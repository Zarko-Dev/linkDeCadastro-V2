# O -> N -> On Manifesto

## Proposito

Este manifesto define um principio de sustentabilidade para a `linkDeCadastro-V2`.

Ele serve para guiar:

- arquitetura
- design de produto
- experiencia de usuario
- implementacao tecnica
- trabalho dos agentes

## O que significa

### O

`O` significa `origem`.

Toda decisao nova precisa respeitar a origem do dominio:

- qual problema ela resolve
- a que contexto ela pertence
- qual modulo e responsavel por isso
- qual fonte de verdade sustenta esse comportamento

Sem origem clara, o sistema volta a virar um bloco acoplado.

### N

`N` significa `novo`.

Toda nova capacidade deve entrar com fronteira explicita:

- nova tela
- novo fluxo
- novo agente
- nova automacao
- nova integracao
- novo datastore

O novo nao entra por improviso. Ele entra com:

- contrato
- responsabilidade
- limite de impacto
- encaixe na arquitetura

### On

`On` significa `ligado`, `vivo`, `sustentavel`.

O sistema precisa continuar operando e evoluindo sem perder clareza.

Isso implica:

- crescimento modular
- acoplamento controlado
- experiencia coerente
- manutencao viavel
- expansao segura

Nao basta criar algo novo. O novo precisa manter a plataforma ligada e preparada para crescer.

## Regras praticas

1. Nenhuma tela nova entra sem papel claro no produto.
2. Nenhum modulo novo entra sem fronteira explicita.
3. Nenhuma integracao nova entra no lugar errado por conveniencia.
4. Nenhuma automacao deve depender de fluxo confuso ou ambiguidade estrutural.
5. O design deve escalar de forma coerente entre mobile e desktop.
6. O frontend nao deve concentrar comportamento sem contrato de API.
7. O backend nao deve absorver tudo no mesmo modulo.
8. O chat e o core devem continuar separados por dominio.
9. Agentes e automacoes devem ampliar a plataforma, nao baguncar a base.
10. Toda evolucao precisa melhorar a capacidade do sistema de continuar `On`.

## Aplicacao na V2

### Frontend

- mobile e desktop devem compartilhar principios, nao layouts acidentais
- motion deve reforcar hierarquia, nao servir de enfeite
- dashboard, login, formularios, chat, agentes, automacoes e integracoes devem compor um sistema unico

### API

- PostgreSQL permanece como base do core
- MongoDB permanece no dominio de WhatsApp/chat
- S3 permanece no dominio de media
- fila e workers entram como evolucao natural, nao como improviso

### Produto

A plataforma deve permitir que o cliente:

- entenda o contexto
- configure agentes
- conecte canais
- crie automacoes
- tome acao dentro do sistema

Ou seja: menos tela solta, mais sistema operacional de negocio.

## Regra final

Sempre perguntar:

- qual a origem disso
- por que isso entra como novo
- isso mantem a plataforma ligada de forma sustentavel

Se a resposta nao estiver clara, a decisao ainda nao esta madura.
