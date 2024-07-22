## Opções de carregamento do ambiente

### DFE

| Chave                          | Descrição | Required  |
|--------------------------------|-----------|-----------|
| `baixarXMLDistribuicao`        | Define se os XMLs retornados pelo método NFeDistribuicaoDFe serão salvos. | Opcional |
| `pathXMLDistribuicao`          | Define onde os XMLs retornados pelo método NFeDistribuicaoDFe serão salvos. | Opcional |
| `armazenarXMLAutorizacao`      | Define se o XML gerado na emissão de NF-e deve ser salvo. | Opcional |
| `pathXMLAutorizacao`           | Define onde o XML gerado na emissão de NF-e será salvo. | Opcional |
| `armazenarXMLConsulta`         | Define se os XMLs de consulta (gerados pela lib) e Retorno (retornados pela SEFAZ) serão salvos. | Opcional |
| `pathXMLConsulta`     | Define onde os XMLs de consulta (gerados pela lib) e os XML de retorno (retornados pela SEFAZ) serão salvos. | Opcional |
| `armazenarXMLConsultaComTagSoap`| Define se os XMLs de consulta (gerados pela lib) devem ser armazenados com a tag soap. | Opcional |
| `armazenarXMLRetorno`          | Define se os XMLs de consulta (gerados pela lib) e Retorno (retornados pela SEFAZ) serão salvos. | Opcional |
| `pathXMLRetorno`      | Define onde os XMLs de consulta (gerados pela lib) e os XML de retorno (retornados pela SEFAZ) serão salvos. | Opcional |
| `armazenarRetornoEmJSON`       | Define se o retorno da SEFAZ deverá ser salvo em JSON. | Opcional |
| `pathRetornoEmJSON`   | Define onde o arquivo JSON gerado a partir do retorno da SEFAZ será salvo. | Opcional |
| `incluirTimestampNoNomeDosArquivos` | Define se deverão ser incluídos data e hora no fim do nome dos arquivos (Aplicados apenas nos arquivos do XMLRetorno e XMLConsulta). | Opcional |
| `pathCertificado`              | Caminho e nome do certificado digital. | Obrigatório |
| `senhaCertificado`             | Senha do certificado digital. | Obrigatório |
| `UF`                           | UF da pessoa vinculada ao certificado digital. | Opcional |
| `CPFCNPJ`                      | CPF/CNPJ da pessoa vinculada ao certificado digital. | Opcional |

### NFE

| Chave    | Descrição | Required  |
|----------|-----------|-----------|
| `ambiente`| Define o ambiente que receberá os XML da NF-e:<br>1 = Produção<br>2 = Homologação | Obrigatório |
| `versaoDF`        | Define a versão da NF-e (Testada apenas 4.00):<br>2.00 = Versão 2.00<br>3.00 = Versão 3.00<br>3.10 = Versão 3.10<br>4.00 = Versão 4.00 | Obrigatório |

### EMAIL

| Chave                | Descrição                                                                                       | Required     |
|----------------------|-------------------------------------------------------------------------------------------------|--------------|
| `host`               | Host SMTP do seu provedor de e-mail                                                              | Obrigatório  |
| `port`               | Porta do servidor SMTP                                                                          | Obrigatório  |
| `secure`             | `true` para SSL, `false` para outros                                                            | Obrigatório  |
| `auth`               | Dados para autenticação no servidor SMTP                                                         | Obrigatório  |
| `auth.user`          | Seu e-mail para autenticação no servidor SMTP                                                    | Obrigatório  |
| `auth.pass`          | Sua senha para autenticação no servidor SMTP                                                     | Obrigatório  |
| `emailParams`        | Dados para envio do e-mail                                                                      | Obrigatório  |
| `emailParams.from`   | Remetente padrão                                                                               | Obrigatório  |
| `emailParams.to`     | Destinatário padrão                                                                             | Obrigatório  |
| `emailParams.subject`| Assunto padrão                                                                                 | Obrigatório  |


### lib

| Chave                    | Descrição | Required  |
|--------------------------|-----------|-----------|
| `connection`             | Define configurações das requisições | Opcional |
| &nbsp;&nbsp;&nbsp;&nbsp; `timeout` | Define o tempo limite em milissegundos para as requisições HTTP feitas pela lib | Opcional, padrão: 60000 |
| `log`             | Define configurações de log | Opcional |
| &nbsp;&nbsp;&nbsp;&nbsp;`exibirLogNoConsole` | Define se os logs devem ser exibidos no console (Em desenvolvimento)| Opcional, padrão: false |