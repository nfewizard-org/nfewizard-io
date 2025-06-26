import { logger } from '@Core/exceptions/logger';
import { NFeWizardProps } from '@Types';

class ValidateEnvironment {
    checkRequiredSettings(config: NFeWizardProps) {
        logger.info('Verificando parâmetros de inicialização', {
            context: 'ValidateEnvironment',
            config: {
                pathCertificado: config.dfe.pathCertificado,
                senhaCertificado: config.dfe.senhaCertificado,
                ambiente: config.nfe.ambiente
            }
        });

        try {
            const requiredConfigFields: { [K in keyof NFeWizardProps]: string[] } = {
                dfe: ['pathCertificado', 'senhaCertificado'],
                nfe: ['ambiente']
            };

            let missingConfigurations: any = {
                dfe: [],
                nfe: []
            };

            let errors: string[] = [];
            let tableData: any[] = [];

            (Object.keys(requiredConfigFields) as (keyof NFeWizardProps)[]).forEach((categoryKey) => {
                const category = config[categoryKey as keyof typeof config];

                // Verifica se a chave principal existe
                if (!category) {
                    errors.push(`Chave principal faltando: '${categoryKey}'.`);
                    tableData.push({ Categoria: categoryKey, Faltando: `Chave principal faltando` });
                } else {
                    const fields = requiredConfigFields[categoryKey];
                    if (fields) {
                        fields.forEach((fieldKey) => {
                            // Garante que missingConfigurations[categoryKey] é um array
                            if (!missingConfigurations[categoryKey]) {
                                missingConfigurations[categoryKey] = [];
                            }

                            // Verifica se o campo está presente
                            if (category[fieldKey as keyof typeof category] === undefined) {
                                // Garante que a propriedade está definida
                                if (!missingConfigurations[categoryKey]) {
                                    missingConfigurations[categoryKey] = [];
                                }
                                missingConfigurations[categoryKey].push(fieldKey);
                            }
                        });

                        // Garante que missingConfigurations[categoryKey] é um array
                        const missingConfig = missingConfigurations[categoryKey];
                        if (missingConfig && missingConfig.length > 0) {
                            errors.push(`Configurações faltando em '${categoryKey}': [${missingConfig.join(', ')}].`);
                            tableData.push({ Categoria: categoryKey, Faltando: missingConfig.join(', ') });
                        }
                    }
                }
            });

            if (errors.length > 0) {
                console.log("Configurações necessárias faltando:");
                console.table(tableData);
                throw new Error(`Erro ao validar configurações: ${errors.join(' ')}`);
            }

            return {
                missingConfigurations,
                message: 'Todas as configurações necessárias estão presentes.',
                success: true,
            };
        } catch (error: any) {
            logger.error('Erro ao inicializar ambiente', error, {
                context: 'ValidateEnvironment',
                method: 'checkRequiredSettings',
            });
            throw new Error(`Erro ao inicializar ambiente: ${error.message}`);
        }
    }
}

export default ValidateEnvironment;