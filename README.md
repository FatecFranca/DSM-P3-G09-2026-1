<div align="center">

# 📦 Estokai

**Sistema de controle de estoque para microempresas**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?logo=nodedotjs)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Prisma%20ORM-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://estokai-ll6q.vercel.app)
[![License](https://img.shields.io/badge/license-Proprietária-red)](LICENSE.md)

[Demo ao vivo](https://estokai-ll6q.vercel.app) · [Reportar bug](https://github.com/GuiPorto20/estokai/issues) · [Sugerir feature](https://github.com/GuiPorto20/estokai/issues)

</div>

---

> **⚠️ Aviso de Direitos Autorais:** Este repositório encontra-se público estritamente para servir como portfólio técnico e demonstração de arquitetura de software. O código-fonte aqui presente pertence a um produto comercial e **não é de código aberto (open-source)**. A cópia, distribuição, clonagem, modificação ou utilização comercial deste software é expressamente proibida sem autorização prévia. Consulte o arquivo `LICENSE.md` para obter todos os detalhes legais.

---

## Sobre o projeto

O **Estokai** é uma aplicação web full-stack voltada para o gerenciamento de estoque de microempresas. Com ele é possível cadastrar produtos, fornecedores e clientes, registrar pedidos com baixa automática de estoque, acompanhar movimentações e visualizar um dashboard com os principais indicadores do negócio — tudo com suporte a tema claro/escuro e autenticação segura por JWT.

---

## Funcionalidades

- **Dashboard** — visão geral com KPIs do dia e do mês: produtos cadastrados, pedidos, clientes, fornecedores, estoque crítico e pedidos recentes
- **Produtos** — CRUD completo com upload de imagem (Cloudinary), preço de custo/venda, quantidade em estoque e quantidade mínima configurável
- **Pedidos** — criação e edição de pedidos com múltiplos itens, formas de pagamento e controle de status; movimentação de estoque automática na criação/alteração/cancelamento
- **Clientes** — cadastro de pessoas físicas e jurídicas com suporte a CPF/CNPJ, endereço completo e múltiplos contatos
- **Fornecedores** — cadastro com CNPJ, categorias e vinculação de produtos com registro do preço da última compra
- **Movimentações** — histórico completo de entradas e saídas com justificativa, rastreável por produto ou por pedido
- **Relatorios** — Relatorios para fechamento de caixa, gerado por periodo selecionado e impressao em PDF
- **Autenticação** — registro e login com senha hasheada (bcrypt), token JWT via cookie (7 dias) e proteção de rotas no Next.js middleware
- **Painel Admin** — gerenciamento de usuários da plataforma (listar e remover)
- **Tema escuro/claro** — suporte nativo via `next-themes`

---

## Stack

### Frontend
| Tecnologia | Uso |
|---|---|
| Next.js 16 + React 19 | Framework principal e renderização |
| TypeScript | Tipagem estática |
| Tailwind CSS v4 | Estilização |
| shadcn/ui + Radix UI | Componentes de interface |
| Framer Motion | Animações |
| TanStack Table | Tabelas com paginação e ordenação |
| React Hook Form + Zod | Formulários com validação |
| Axios | Requisições HTTP |
| Sonner | Notificações toast |

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js + Express 5 | API REST |
| Prisma ORM | Acesso ao banco de dados |
| MongoDB | Banco de dados |
| JSON Web Token | Autenticação |
| bcrypt | Hash de senhas |
| Cloudinary + Multer | Upload de imagens |
| compression | Compressão gzip/brotli das respostas |

---
## Estrutura do projeto

```
estokai/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Modelos: Usuario, Produto, Pedido, Cliente, Fornecedor, Movimentacao
│   └── src/
│       ├── controllers/           # Lógica de cada recurso
│       ├── routes/                # Endpoints da API
│       ├── services/              # Regras de negócio (ex: movimentação de estoque)
│       ├── middlewares/           # authMiddleware, adminMiddleware, uploadMiddleware
│       ├── config/                # Configuração do Cloudinary
│       └── app.js                 # Express app com CORS, compressão e tratamento de erros
│
├── frontend/
│   └── src/
│       ├── app/                   # Páginas (App Router): dashboard, produtos, pedidos, clientes, fornecedores, movimentacao, admin, login
│       ├── components/            # Componentes reutilizáveis e modais por entidade
│       ├── services/              # Camada de comunicação com a API
│       ├── hooks/                 # Hooks customizados
│       └── middleware.js          # Proteção de rotas via cookie JWT
│
└── docs/
    ├── DIAGRAMA *.png / .svg      # Diagrama de entidades
    └── DOCUMENTO COMPLEMENTAR.pdf # Documentação técnica complementar
```

---

## Pré-requisitos

- Node.js >= 18
- Uma instância de MongoDB (local ou [MongoDB Atlas](https://www.mongodb.com/atlas))
- Conta no [Cloudinary](https://cloudinary.com/) para upload de imagens

---

## Instalação e execução

### 1. Clone o repositório

```bash
git clone https://github.com/GuiPorto20/estokai.git
cd estokai
```

### 2. Configure o backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` dentro de `backend/`:

```env
DATABASE_URL="mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<banco>"
JWT_SECRET="sua_chave_secreta_aqui"
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"
NODE_ENV="development"
```

Execute as migrations e inicie o servidor:

```bash
npx prisma generate
npm run dev        # desenvolvimento (nodemon)
# ou
npm start          # produção
```

O servidor sobe em `http://localhost:3001` por padrão.

### 3. Configure o frontend

```bash
cd ../frontend
npm install
```

Crie o arquivo `.env.local` dentro de `frontend/`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:3000`.

---

## Endpoints principais da API

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Cadastro de usuário |
| `POST` | `/auth/login` | Login e geração de token |
| `GET` | `/dashboard` | Resumo completo para o dashboard |
| `GET/POST` | `/produtos` | Listar e criar produtos |
| `PUT/DELETE` | `/produtos/:id` | Editar e remover produto |
| `POST` | `/produtos/:id/fornecedor` | Vincular fornecedor a produto |
| `GET/POST` | `/pedidos` | Listar e criar pedidos |
| `PUT/DELETE` | `/pedidos/:id` | Editar e cancelar pedido |
| `GET/POST` | `/clientes` | Listar e criar clientes |
| `GET/POST` | `/fornecedores` | Listar e criar fornecedores |
| `GET` | `/movimentacoes` | Histórico de movimentações |
| `GET` | `/admin` | Gerenciamento de usuários (admin only) |

> Todas as rotas, exceto `/auth/*`, exigem o header `Authorization: Bearer <token>` ou cookie `token`.

---

## Deploy

O frontend está hospedado na **Vercel**: [estokai-ll6q.vercel.app](https://estokai-ll6q.vercel.app)

Para deploy do backend, o `app.js` já está preparado para ambiente de produção — logs são suprimidos automaticamente quando `NODE_ENV=production`.

---

## Documentação adicional

A pasta `docs/` contém:
- Diagrama de entidades do banco de dados (`.png`, `.svg` e `.xml` editável no draw.io)
- Documento complementar com especificações técnicas do sistema (`.pdf`)

---

## Licença

Distribuído sob a licença MIT. Veja [`LICENSE`](LICENSE) para mais informações.

---

<div align="center">
  Feito por <a href="https://github.com/GuiPorto20">Guilherme Porto</a> e <a href="https://github.com/LeonardoBonamin">Leonardo Bonamin</a>
</div>
