# UI Desktop Reference Direction

## Objetivo

Definir a direção visual do desktop da `linkDeCadastro-V2` como um produto SaaS/AI premium, contemporâneo e intencional. Esta direção substitui qualquer leitura de painel administrativo clássico e deve guiar a home e as telas-chave com composição forte, módulos operacionais elegantes e fluxo claro.

## O que evitar

Essa referência serve para evitar o seguinte estilo:

- sidebar pesada e dominante
- cards brancos genéricos sobre fundo neutro
- aparência de sistema legado ou painel administrativo tradicional
- listas sem hierarquia e sem tensão visual
- telas com densidade excessiva sem respiro editorial
- layout que pareça um CRUD comum com roupa nova

## Leitura visual desejada

A V2 deve parecer:

- premium
- estratégica
- operacional
- modular
- pronta para automação com agentes
- mais SaaS/AI do que admin

O desktop precisa comunicar:

- direção
- estado
- comando
- inteligência operacional
- clareza de decisão

## Princípio O -> N -> On

Este princípio deve orientar todas as telas:

- `O` = Orientação ou Overview: o usuário entende rapidamente onde está e qual é o estado do sistema
- `N` = Navegação: o caminho até módulos e ações fica claro, direto e não invasivo
- `On` = Operação: o usuário executa a ação principal sem ruído, com módulos e estados visíveis

Regras do princípio:

- a tela sempre começa por orientação
- a navegação nunca deve competir com a operação
- a operação deve ser o ponto de maior densidade visual
- a estrutura precisa ser sustentável, modular e clara

## Composição

### Estrutura base

Usar uma composição em 3 zonas:

- `rail lateral`: navegação enxuta, identidade e contexto persistente
- `canvas principal`: hero, visão do produto, módulos de decisão e operação
- `painel auxiliar`: contexto, status, fila, integrações, atividade recente e atalhos

### Hierarquia visual

O desktop deve obedecer esta ordem:

1. orientação do contexto
2. módulo principal ou hero
3. status do sistema e decisões rápidas
4. listas e painéis operacionais
5. detalhes e suporte

### Distribuição sugerida

- usar grid assimétrico, nunca blocos com o mesmo peso por padrão
- o canvas principal deve dominar a tela
- os painéis auxiliares devem funcionar como camadas de apoio
- a composição deve parecer um workspace premium, não uma planilha

## Navegação

### Rail lateral

A navegação lateral no desktop deve ser permanente, porém mais leve e curada do que um sidebar administrativo tradicional.

### Comportamento

- item ativo com contraste nítido, fundo sutilmente elevado e borda suave
- hover com deslocamento pequeno e sensação de profundidade
- agrupamento por fluxo de produto, não por estrutura técnica

### Conteúdo da navegação

- Dashboard
- Login
- Formulário
- Chat WPP
- Agentes
- Automações
- Integrações
- Cursos
- Eventos
- Usuários

### Regras

- nunca esconder a navegação principal em desktop
- a navegação deve parecer curada, não pesada
- o topo da área principal deve sempre contextualizar a tarefa atual

## Painéis

### Tipos de painel

Usar três famílias de painel:

- `hero panel`: bloco principal com narrativa, visão e próximo passo
- `status panel`: health, auth, integrações, fila, contadores
- `work panel`: formulários, inbox, construtores de agentes, automações e listas

### Linguagem visual

- bordas suaves com raio generoso
- superfícies escuras, grafite ou metal quente
- acentos discretos e sofisticados
- sombras difusas, profundas e controladas
- separação por profundidade, não por linhas duras

### Uso por página

#### Login

- bloco hero de boas-vindas e posicionamento do produto
- card de autenticação com foco e sem poluição
- aparência de acesso a console premium, não de login genérico

#### Dashboard

- resumo do estado do sistema
- módulos de ação rápida
- bloco de contexto para agentes, automações e integrações
- leitura de produto antes de leitura de tabela

#### Formulário

- editor de formulário com painel de composição
- preview ou contexto do fluxo ao lado
- experiência de construção, não de cadastro comum

#### Chat WPP

- inbox em três zonas: lista, thread, ação
- painel de fila e workers visível
- sensação de central operacional viva

#### Agentes

- builder de agente com parâmetros, papel e domínio
- lista de agentes como inventário de inteligência
- foco em decisão e responsabilidade do agente

#### Automações

- construtor visual de trigger, condição e ação
- preview do encadeamento lógico
- cards de automação com leitura imediata do estado

#### Integrações

- cartões de canais com status premium
- detalhamento de sync, permissão e última sincronização
- foco em conectividade como capacidade do produto

#### Cursos e Eventos

- continuam no universo premium, mas com leitura de catálogo e operação
- cards largos, status legível e poucas distrações

## Motion

Usar `motion` como camada de percepção e direção, não como enfeite.

### Onde aplicar

- entrada da página com fade + leve deslocamento
- cards surgindo em cascata
- hover de cards e itens de navegação
- transições entre estados de formulários, threads e integrações
- troca de estados em badges e painéis auxiliares

### Regras de motion

- duração curta: entre 160ms e 420ms
- easing suave e sofisticado
- sempre respeitar `prefers-reduced-motion`
- movimento pequeno, intencional e legível

### Padrão recomendado

- `FadeIn` para hero e blocos de abertura
- `StaggerGroup` para cards e listas
- `AnimatedPage` para troca de rota
- hover com deslocamento pequeno, nunca com salto

## Tokens e classes sugeridos

### Estrutura

- `.desktop-cockpit-shell`
- `.desktop-rail`
- `.desktop-main`
- `.desktop-main-grid`
- `.desktop-hero`
- `.desktop-hero-panel`
- `.desktop-side-panel`
- `.desktop-operation-grid`

### Estados

- `.is-active`
- `.is-muted`
- `.is-warning`
- `.is-success`
- `.is-elevated`

### Componentes

- `.panel`
- `.panel-accent`
- `.panel-dark`
- `.surface`
- `.surface-strong`
- `.status-pill`
- `.metric-card`
- `.workspace-card`
- `.workspace-card-large`
- `.workspace-card-small`
- `.nav-item`
- `.nav-item-active`

### Variáveis de tema

- `--bg`
- `--bg-elevated`
- `--surface`
- `--surface-strong`
- `--text`
- `--text-muted`
- `--border`
- `--accent`
- `--accent-soft`
- `--shadow-lg`

### Direção de cor

O desktop deve operar em uma paleta escura e premium, com:

- fundo grafite ou grafite esverdeado
- superfícies em preto suave, chumbo e cinza quente
- texto principal quase branco
- acentos em verde, areia, metal ou off-white

## Padrões de layout

### Home desktop

- hero grande com resumo do produto e do estado operacional
- cards de ação e estado com composição assimétrica
- área de atalhos orientada a tarefas
- painel lateral com contexto de sistema e agentes

### Dashboard

- visão de comando, não de relatório
- módulos de ação rápida em destaque
- indicadores úteis antes de métricas decorativas

### Tela de automações

- builder modular com fluxo claro
- preview do encadeamento lógico
- prioridade para legibilidade da automação

### Tela de chat WPP

- foco no inbox, fila e resposta operacional
- três colunas no desktop sempre que houver espaço
- thread central com compostura visual forte

### Tela admin

- pode ser densa, mas nunca tradicional
- deve parecer um console de produto
- listas e formulários precisam parecer partes de um sistema vivo

## Prioridades de implementação

### Fase 1

- consolidar o desktop shell sem aparência de admin clássico
- aplicar o novo grid na home e dashboard
- alinhar login, formulário e integrações à nova linguagem
- padronizar motion base

### Fase 2

- aplicar a direção em cursos, eventos e usuários
- ajustar chat WPP para foco operacional premium
- criar variações de card e painel com profundidade

### Fase 3

- levar a linguagem para agentes e automações
- refinar estados vazios, loading e erros
- revisar acessibilidade e responsividade fina

## Regras de qualidade

- desktop precisa parecer proposital, não um responsivo forçado
- a base mobile não pode ser sacrificada
- contraste e legibilidade vêm antes de enfeite
- toda animação precisa ter função clara
- a experiência deve parecer a mesma família visual entre desktop e mobile, mas com personalidade diferente

## Resultado esperado

Ao terminar essa direção, a V2 deve parecer:

- mais premium
- mais SaaS/AI
- mais operacional
- mais inteligente
- mais coerente
- menos “painel administrativo”, mais plataforma de ação
