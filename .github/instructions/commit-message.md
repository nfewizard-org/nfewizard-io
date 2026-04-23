# Padrão de Mensagens de Commit

Sempre que gerar uma mensagem de commit, siga obrigatoriamente as regras abaixo.

Estas regras são obrigatórias para geração automática de commits.

## Idioma

- A descrição curta e o corpo DEVEM estar em português brasileiro (pt-BR)
- Nunca escreva a mensagem em inglês

## Formato

Use exatamente este formato:

<tipo>(<escopo opcional>): <descrição curta em imperativo, pt-BR>

Linha em branco

Corpo opcional explicando o PORQUÊ da mudança (não o que foi feito)

Linha em branco

Rodapé opcional como:
BREAKING CHANGE: descrição
closes #numero

## Tipos permitidos

- feat: nova funcionalidade
- fix: correção de bug
- hotfix: correção crítica em produção
- refactor: refatoração sem mudança de comportamento externo
- chore: manutenção, configuração, dependências, CI/CD
- test: adição ou alteração de testes
- docs: documentação

## Regras da descrição curta

- Usar verbo no imperativo (ex: adiciona, corrige, remove, atualiza)
- Máximo de 72 caracteres
- Não usar ponto final
- Não capitalizar a primeira letra após o tipo

## Exemplos corretos

feat: adiciona templates de PR e regra de geração de commit  
fix(auth): corrige validação de token expirado  
chore: atualiza dependências do projeto  
refactor(user): extrai lógica de validação para serviço dedicado  

## Exemplos incorretos

feat: add PR templates and commit message rules  
feat: Adiciona templates de PR.  
update stuff  

## Regras Incontestáveis

- NUNCA crie Pull Requests com destino direto para main ou master
- NUNCA execute git push automaticamente ou altere histórico remoto