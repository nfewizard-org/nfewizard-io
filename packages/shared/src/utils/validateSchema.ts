/*
 * This file is part of NFeWizard-io.
 * 
 * NFeWizard-io is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * NFeWizard-io is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with NFeWizard-io. If not, see <https://www.gnu.org/licenses/>.
 */

import libxmljs from 'libxmljs2';
import xsdAssembler from 'xsd-assembler';
import xsdValidator from 'xsd-schema-validator';
import { getSchema } from '../adapters/SchemaLoader.js';
import type { Environment } from '../environment/Environment.js';

/** Estratégias de validação de schema disponíveis. */
export type SchemaValidator = 'validateSchemaJsBased' | 'validateSchemaJavaBased';

/**
 * Nomes de métodos/operações fiscais aceitos pela validação de schema.
 * Devem corresponder às chaves mapeadas em `SchemaLoader.getSchema`.
 */
export type SchemaValidateMethod =
    | 'NFEStatusServico'
    | 'NFEConsultaProtocolo'
    | 'RecepcaoEvento'
    | 'NFeDistribuicaoDFe'
    | 'NFEAutorizacao'
    | 'NFeAutorizacao'
    | 'NFEInutilizacao'
    | 'NFERetAutorizacao'
    | 'CTeDistribuicaoDFe'
    | 'NFSe_Autorizacao'
    | 'NFSe_Consulta'
    | 'NFSe_Distribuicao'
    | 'NFSe_Eventos'
    | 'NFSe_ParametrosMunicipais';

/**
 * Erro individual de validação de schema, já com mensagem original e versão humanizada.
 */
export interface SchemaValidationIssue {
    /** Mensagem original retornada pelo parser/validador (libxmljs ou xsd-schema-validator). */
    raw: string;
    /** Versão amigável da mensagem, em português, sem namespaces. */
    humanized: string;
    /** Elemento XML envolvido (quando identificável). Ex.: `NFe`, `infNFe`, `ide`. */
    element?: string;
    /** Atributo envolvido (quando o erro for em atributo). */
    attribute?: string;
    /** Filhos/valores esperados extraídos da mensagem (quando aplicável). */
    expected?: string[];
    /** Linha do XML reportada pelo validador. */
    line?: number;
    /** Coluna do XML reportada pelo validador. */
    column?: number;
}

/**
 * Resultado completo da validação. Compatível com o retorno anterior
 * (`{ success, message }`) e expandido com campos adicionais.
 */
export interface SchemaValidationResult {
    success: boolean;
    /** Mensagem-resumo (humanizada). Em sucesso: `'XML válido.'`. */
    message: string;
    /** Lista de todos os erros de schema encontrados. Vazia em sucesso. */
    errors: SchemaValidationIssue[];
    /** Relatório multilinha pronto para `console.log`, no estilo do validador SEFAZ-RS. */
    report: string;
    /** Linhas estruturadas para `console.table(result.tableRows)`. */
    tableRows: Array<{ '#': number; Linha: number | ''; Elemento: string; Mensagem: string }>;
    /** Método/schema utilizado na validação. */
    metodo: SchemaValidateMethod;
    /** Nome do arquivo XSD aplicado. */
    schema: string;
}

export interface NFESchemaValidateOptions {
    /**
     * Qual validador utilizar.
     *
     * - `'validateSchemaJsBased'` — usa `libxmljs2` + `xsd-assembler` (sem JDK).
     * - `'validateSchemaJavaBased'` — usa `xsd-schema-validator` (requer JDK).
     *
     * Quando não informado, lê `lib.useForSchemaValidation` da configuração da lib
     * (via `environment`); se nenhum dos dois estiver definido, aplica
     * `'validateSchemaJsBased'` como padrão.
     */
    validator?: SchemaValidator;
    /**
     * Instância do `Environment` inicializada pela lib. Usada apenas para ler
     * `lib.useForSchemaValidation` quando `validator` não for informado
     * explicitamente.
     */
    environment?: Environment;
}

/** Remove o prefixo `{namespace}` deixando apenas o nome local do elemento. */
function stripNamespace(name: string): string {
    return name.replace(/^\{[^}]*\}/, '');
}

/**
 * Interpreta uma mensagem de erro do libxmljs2 / xsd-schema-validator e retorna
 * um `SchemaValidationIssue` com versão humanizada + metadados estruturados.
 */
function humanizeIssue(raw: string, line?: number, column?: number): SchemaValidationIssue {
    const issue: SchemaValidationIssue = { raw, humanized: raw, line, column };

    // 1) Elemento com filhos ausentes
    //    Element '{ns}Nome': Missing child element(s). Expected is one of ( {ns}a, {ns}b ).
    let m = raw.match(/Element\s+'([^']+)':\s*Missing child element\(s\)\.\s*Expected is one of\s*\(\s*([^)]+)\s*\)\.?/i);
    if (m) {
        const element = stripNamespace(m[1]);
        const expected = m[2].split(',').map((s) => stripNamespace(s.trim())).filter(Boolean);
        issue.element = element;
        issue.expected = expected;
        issue.humanized = `Elemento <${element}> está incompleto. Filho ausente, esperado um de: ${expected.join(', ')}.`;
        return issue;
    }

    // 2) Elemento não esperado
    //    Element '{ns}Nome': This element is not expected. Expected is one of ( {ns}a, {ns}b ).
    m = raw.match(/Element\s+'([^']+)':\s*This element is not expected\.\s*(?:Expected is one of\s*\(\s*([^)]+)\s*\)\.?)?/i);
    if (m) {
        const element = stripNamespace(m[1]);
        issue.element = element;
        if (m[2]) {
            issue.expected = m[2].split(',').map((s) => stripNamespace(s.trim())).filter(Boolean);
            issue.humanized = `Elemento <${element}> inesperado nesta posição. Esperado um de: ${issue.expected.join(', ')}.`;
        } else {
            issue.humanized = `Elemento <${element}> inesperado nesta posição.`;
        }
        return issue;
    }

    // 3) Atributo inválido / faltando
    //    Element '{ns}Nome', attribute 'attr': ...
    m = raw.match(/Element\s+'([^']+)',\s*attribute\s+'([^']+)':\s*(.+?)\.?$/i);
    if (m) {
        const element = stripNamespace(m[1]);
        const attribute = m[2];
        const desc = m[3];
        issue.element = element;
        issue.attribute = attribute;
        issue.humanized = `Elemento <${element}> — atributo "${attribute}": ${desc}.`;
        return issue;
    }

    // 4) Valor inválido para tipo
    //    Element '{ns}Nome': [facet 'pattern'] The value '...' is not accepted by the pattern '...'.
    //    Element '{ns}Nome': '...' is not a valid value of the atomic type 'TString'.
    m = raw.match(/Element\s+'([^']+)':\s*(?:\[facet[^\]]*\]\s*)?(.+?)\.?$/i);
    if (m) {
        const element = stripNamespace(m[1]);
        issue.element = element;
        issue.humanized = `Elemento <${element}>: ${m[2]}.`;
        return issue;
    }

    // 5) Sem padrão reconhecido — devolve raw como humanizado
    return issue;
}

/** Cria um issue "interno" quando o erro não veio do schema (ex.: XML mal formado). */
function internalIssue(raw: string): SchemaValidationIssue {
    return { raw, humanized: raw };
}

/**
 * Monta o relatório textual estilo SEFAZ-RS pronto para `console.log`.
 */
function buildReport(metodo: SchemaValidateMethod, schemaFile: string, errors: SchemaValidationIssue[]): string {
    const linhas: string[] = [];
    linhas.push('=== Resultado da Validação do Schema ===');
    linhas.push(`Tipo de Mensagem: ${metodo}`);
    linhas.push(`Schema XML:       ${schemaFile}`);

    if (errors.length === 0) {
        linhas.push('Parser XML:       Nenhum erro encontrado');
        linhas.push('Schema XML:       Nenhum erro encontrado');
        linhas.push('Status:           XML válido.');
    } else {
        linhas.push(`Status:           ${errors.length} erro(s) de validação`);
        linhas.push('');
        errors.forEach((err, idx) => {
            const pos = err.line ? ` (linha ${err.line}${err.column ? `, col ${err.column}` : ''})` : '';
            linhas.push(`  ${idx + 1}. ${err.humanized}${pos}`);
        });
    }

    linhas.push('=========================================');
    return linhas.join('\n');
}

/** Converte a lista de erros em linhas para `console.table`. */
function buildTableRows(errors: SchemaValidationIssue[]): SchemaValidationResult['tableRows'] {
    if (errors.length === 0) {
        return [{ '#': 1, Linha: '', Elemento: '-', Mensagem: 'XML válido.' }];
    }
    return errors.map((err, idx) => ({
        '#': idx + 1,
        Linha: err.line ?? '',
        Elemento: err.element ?? '-',
        Mensagem: err.humanized,
    }));
}

function schemaFileName(schemaPath: string): string {
    if (!schemaPath) return '-';
    const parts = schemaPath.split(/[\\/]/);
    return parts[parts.length - 1] || schemaPath;
}

function makeResult(
    success: boolean,
    metodo: SchemaValidateMethod,
    schemaPath: string,
    errors: SchemaValidationIssue[],
): SchemaValidationResult {
    const schema = schemaFileName(schemaPath);
    const report = buildReport(metodo, schema, errors);
    const message = success
        ? 'XML válido.'
        : errors[0]?.humanized ?? 'Erro de validação não identificado.';
    return {
        success,
        message,
        errors,
        report,
        tableRows: buildTableRows(errors),
        metodo,
        schema,
    };
}

function runJsBased(xml: string, metodo: SchemaValidateMethod): Promise<SchemaValidationResult> {
    return new Promise(async (resolve, reject) => {
        const { basePath, schemaPath } = getSchema(metodo);
        if (!schemaPath) {
            reject(makeResult(false, metodo, '', [internalIssue(
                `Schema XSD não encontrado para o método '${metodo}'. Verifique se o nome do método está correto.`,
            )]));
            return;
        }

        try {
            const completeXSD = await xsdAssembler.assemble(schemaPath);
            const xmlDoc = libxmljs.parseXml(xml);
            const xsdDoc = libxmljs.parseXml(completeXSD, { baseUrl: `${basePath}/` });

            const isValid = xmlDoc.validate(xsdDoc);
            if (isValid) {
                resolve(makeResult(true, metodo, schemaPath, []));
                return;
            }

            const errors: SchemaValidationIssue[] = (xmlDoc.validationErrors || []).map((e: any) =>
                humanizeIssue(String(e.message ?? e).trim(), e.line, e.column),
            );
            reject(makeResult(false, metodo, schemaPath, errors.length ? errors : [internalIssue('XML inválido (sem detalhes do validador).')]));
        } catch (error: any) {
            reject(makeResult(false, metodo, schemaPath, [internalIssue(String(error?.message ?? error))]));
        }
    });
}

function runJavaBased(xml: string, metodo: SchemaValidateMethod): Promise<SchemaValidationResult> {
    return new Promise((resolve, reject) => {
        const { schemaPath } = getSchema(metodo);
        if (!schemaPath) {
            reject(makeResult(false, metodo, '', [internalIssue(
                `Schema XSD não encontrado para o método '${metodo}'. Verifique se o nome do método está correto.`,
            )]));
            return;
        }

        try {
            xsdValidator.validateXML(xml, schemaPath, (err: any, validationResult: any) => {
                if (err) {
                    reject(makeResult(false, metodo, schemaPath, [humanizeIssue(String(err.message ?? err))]));
                    return;
                }
                if (!validationResult?.valid) {
                    const msgs: string[] = validationResult?.messages ?? [];
                    const errors = msgs.length
                        ? msgs.map((m) => humanizeIssue(String(m)))
                        : [internalIssue('XML inválido (sem detalhes do validador).')];
                    reject(makeResult(false, metodo, schemaPath, errors));
                    return;
                }
                resolve(makeResult(true, metodo, schemaPath, []));
            });
        } catch (error: any) {
            reject(makeResult(false, metodo, schemaPath, [internalIssue(String(error?.message ?? error))]));
        }
    });
}

/**
 * Valida um XML contra o schema XSD correspondente ao método fiscal informado.
 *
 * ### Seleção do validador (ordem de prioridade)
 * 1. `options.validator` — escolha explícita do caller.
 * 2. `options.environment.getConfig().lib?.useForSchemaValidation` — valor definido
 *    na inicialização da lib.
 * 3. `'validateSchemaJsBased'` — padrão (sem JDK).
 *
 * @param xml     - String XML a ser validada.
 * @param metodo  - Nome do método/operação fiscal (ex.: `'NFeAutorizacao'`).
 * @param options - Opções opcionais: `validator` e/ou `environment`.
 *
 * @example
 * // Sem opções: usa validateSchemaJsBased
 * await NFE_SchemaValidate(xml, 'NFeAutorizacao');
 *
 * @example
 * // Passando o environment inicializado pela lib (lê useForSchemaValidation do config)
 * await NFE_SchemaValidate(xml, 'NFeAutorizacao', { environment });
 *
 * @example
 * // Forçando um validador específico
 * await NFE_SchemaValidate(xml, 'NFeAutorizacao', { validator: 'validateSchemaJavaBased' });
 */
export function NFE_SchemaValidate(
    xml: string,
    metodo: SchemaValidateMethod,
    options?: NFESchemaValidateOptions,
): Promise<SchemaValidationResult> {
    let chosen: SchemaValidator = 'validateSchemaJsBased';

    if (options?.validator) {
        chosen = options.validator;
    } else if (options?.environment) {
        const fromConfig = options.environment.getConfig()?.lib?.useForSchemaValidation;
        if (fromConfig) chosen = fromConfig;
    }

    const xmlNormalizado = wrapEnviNFeIfNeeded(xml, metodo);

    return chosen === 'validateSchemaJavaBased'
        ? runJavaBased(xmlNormalizado, metodo)
        : runJsBased(xmlNormalizado, metodo);
}

/**
 * Para os métodos de autorização de NF-e, o schema XSD (`enviNFe_v4.00.xsd`)
 * exige que o elemento raiz seja `<enviNFe>`. Quando o caller passa apenas a
 * árvore `<NFe>`, envelopamos automaticamente em `<enviNFe>` com `idLote=1` e
 * `indSinc=1` para que a validação funcione.
 */
function wrapEnviNFeIfNeeded(xml: string, metodo: SchemaValidateMethod): string {
    if (metodo !== 'NFEAutorizacao' && metodo !== 'NFeAutorizacao') return xml;
    const semDecl = xml.replace(/^\s*<\?xml[^?]*\?>\s*/, '').trimStart();
    if (/^<NFe[\s>]/.test(semDecl)) {
        return `<enviNFe versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe"><idLote>1</idLote><indSinc>1</indSinc>${semDecl}</enviNFe>`;
    }
    return xml;
}
