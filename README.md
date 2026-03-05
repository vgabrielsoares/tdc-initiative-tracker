# TDC Initiative Tracker

**Gerenciador de Iniciativa para Tabuleiro do Caos RPG**

Um aplicativo web progressivo (PWA) para gerenciar combates no sistema de RPG Tabuleiro do Caos, com foco em simplicidade e usabilidade para narradores.

[Demo](https://vgabrielsoares.github.io/tdc-initiative-tracker/)

---

## Sobre o Projeto

O **TDC Initiative Tracker** é uma ferramenta frontend-only desenvolvida para facilitar o gerenciamento de combates no RPG **Tabuleiro do Caos**. O sistema implementa as regras de iniciativa do jogo, permitindo que narradores controlem:

- **Ordem de combate** com 4 fases (Turnos Rápidos e Lentos de PJs e NPCs)
- **Rastreamento de recursos** (Guarda, Vitalidade, Defesa) para NPCs
- **Sistema de condições** com duração automática
- **Ações e reações** por turno
- **Persistência local** todos os dados salvos no navegador

Este é o **módulo de combate** da v0.1, projetado como parte de um sistema maior de ferramentas utilitárias para mestres/narradores.

---

## Funcionalidades

### Sistema de Iniciativa

- **4 Fases por Rodada:**
  1. Turno Rápido dos Jogadores (2 ações ▶▶)
  2. Turno Rápido dos NPCs (2 ações ▶▶)
  3. Turno Lento dos Jogadores (3 ações ▶▶▶)
  4. Turno Lento dos NPCs (3 ações ▶▶▶)
- Contador de rodadas visível
- Confirmação ao encerrar fases e rodadas
- Possibilidade de voltar para a fase anterior (se ninguém agiu)

### Gerenciamento de Personagens

- **PJs (Personagens Jogadores):** Nome e condições
- **NPCs:** Nome, Guarda, Vitalidade, Defesa, e status de derrota
- Edição de nomes e recursos durante o combate
- Biblioteca de personagens salvos para reutilização
- Sidebar sempre visível com todos os personagens

### Tracker de Ações (NPCs)

- Exibição visual de ações disponíveis
- Reação (↩) sempre visível e gerenciável
- Reset automático de reações a cada rodada
- Ações livres (∆) não contabilizadas (infinitas)

### Sistema de Condições

- **4 categorias:** Corporais, Mentais, Sensoriais, Espirituais
- 40+ condições diferentes do sistema TDC
- Duração opcional em rodadas (auto-expira)
- Remoção manual a qualquer momento
- Exibição visual com badges

### Persistência & PWA

- Todos os dados salvos localmente (IndexedDB)
- Funciona offline após primeira carga
- Instalável como app nativo
- Preferências de tema (dark/light mode)

### UI/UX

- Interface moderna com Tailwind CSS
- Componentes shadcn/ui
- Ícones lucide-react
- Gradientes, sombras e transições suaves
- Responsivo (desktop-first)
- Dark mode nativo

---

## Tech Stack

| Camada       | Tecnologia                    |
| ------------ | ----------------------------- |
| Framework    | React 19 + TypeScript         |
| Build        | Vite 6                        |
| Estado       | Zustand 5                     |
| Persistência | Dexie 4 (IndexedDB)           |
| Estilo       | Tailwind CSS 4 + shadcn/ui    |
| Ícones       | lucide-react                  |
| PWA          | vite-plugin-pwa + Workbox     |
| Deploy       | GitHub Pages (GitHub Actions) |

---

## Começando

### Pré-requisitos

- Node.js 18+ e npm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/vgabrielsoares/tdc-initiative-tracker.git
cd tdc-initiative-tracker

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O app estará disponível em `http://localhost:5173/tdc-initiative-tracker/`

### Build de Produção

```bash
npm run build
```

Os arquivos serão gerados em `dist/` e podem ser servidos estaticamente.

---

## Como Usar

### 1. Cadastrar Personagens

Na tela inicial, cadastre os participantes do combate:

- **PJs:** Nome apenas
- **NPCs:** Nome, Guarda, Vitalidade e Defesa

Você pode salvar personagens na biblioteca para reutilização.

### 2. Iniciar Combate

Clique em "Iniciar Combate" para entrar na ordem de combate.

### 3. Gerenciar Turnos

- Clique em personagens para marcá-los como "agiram"
- Clique novamente para desfazer
- Use o tracker de ações nos NPCs para marcar ações gastas
- Adicione/remova condições conforme necessário

### 4. Avançar Fases

- Clique em "Encerrar Fase" para avançar (confirmação necessária)
- Clique em "Encerrar Rodada" após a 4ª fase
- Reações resetam automaticamente a cada rodada

### 5. Sidebar de Personagens

Use a sidebar para:

- Visualizar todos os personagens
- Editar recursos de NPCs
- Gerenciar reações fora dos turnos
- Adicionar condições

---

## Estrutura do Projeto

```
src/
├── app/          # Setup da aplicação
├── components/   # Componentes React reutilizáveis
│   └── ui/       # Primitivos shadcn/ui
├── db/           # Schema Dexie e funções de persistência
├── hooks/        # Custom React hooks
├── pages/        # Páginas principais (Setup, Active, etc.)
├── store/        # Zustand store (estado global)
├── types/        # Definições TypeScript
└── utils/        # Funções puras de lógica de negócio
```

---
