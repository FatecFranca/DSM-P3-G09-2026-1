<div align="center">

# 🗃️ Sistema de Controle de Estoque e Pedidos

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
</p>

<p>
  <img src="https://img.shields.io/badge/Status-Concluído-success?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Tipo-Projeto%20Acadêmico-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Semestre-DSM%202026%2F1-orange?style=for-the-badge"/>
</p>

> Plataforma fullstack moderna para gestão completa de estoque, pedidos e operações comerciais — com autenticação segura, dashboard administrativo e controle automático de inventário.

</div>

---

## 👨‍💻 Desenvolvedores

| Nome | GitHub |
|------|--------|
| Guilherme Porto de Melo Junqueira | [@guilherme](https://github.com/GuiPorto20) |
| Leonardo Centeno Bonamin | [@leonardo](https://github.com/LeonardoBonamin) |

---

## 📌 Sobre o Projeto

Este sistema foi desenvolvido como Projeto Interdisciplinar do 3º semestre do curso de **Desenvolvimento de Software Multiplataforma (DSM)**. O objetivo foi construir uma solução fullstack real, aplicando conceitos de arquitetura em camadas, segurança com JWT, integração com banco de dados NoSQL e boas práticas de desenvolvimento.

A aplicação permite gerenciar produtos, clientes, fornecedores e pedidos, com controle automático de estoque via transações atômicas, autenticação protegida por cookies HttpOnly e um dashboard administrativo completo.

---

## ✨ Funcionalidades

### 📦 Produtos
- CRUD completo
- Upload de imagens via Cloudinary
- Controle automático de estoque
- Associação com fornecedores

### 👥 Clientes
- Cadastro e gerenciamento completo
- Histórico de pedidos por cliente

### 🏢 Fornecedores
- Gestão completa de fornecedores
- Associação com produtos cadastrados

### 🧾 Pedidos
- Criação com múltiplos itens
- Cálculo automático do valor total
- Baixa automática no estoque ao confirmar
- Reposição automática ao cancelar
- Validação de estoque insuficiente

### 📉 Movimentações de Estoque
- Registro de entradas e saídas
- Histórico completo de movimentações

### 📊 Dashboard Administrativo
- Pedidos recentes
- Alertas de estoque crítico
- Totalizadores: produtos, clientes, fornecedores
- Pedidos do mês

### 🔐 Autenticação e Segurança
- Login com JWT + Cookies HttpOnly
- Middleware de autenticação no backend
- Middleware de admin para rotas restritas
- Proteção de rotas no frontend (Next.js Middleware)
- Controle de permissões por nível de usuário

---

## 🧱 Stack Tecnológica

### 🎨 Frontend
| Tecnologia | Uso |
|---|---|
| Next.js (App Router) | Framework principal |
| React | UI |
| TailwindCSS | Estilização |
| shadcn/ui | Componentes de interface |
| Axios | Requisições HTTP |
| Lucide Icons | Ícones |

### ⚙️ Backend
| Tecnologia | Uso |
|---|---|
| Node.js | Runtime |
| Express 5.x | Framework HTTP |
| Prisma ORM 6.x | Acesso ao banco de dados |
| MongoDB Atlas | Banco de dados |
| JWT + Cookies HttpOnly | Autenticação segura |
| Cloudinary | Armazenamento de imagens |
| Multer | Upload de arquivos |

---

## 🗂️ Estrutura do Projeto

```
project/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── config/
│       │   └── cloudinary.js
│       ├── controllers/
│       │   ├── clientesControllers.js
│       │   ├── fornecedoresControllers.js
│       │   ├── produtosControllers.js
│       │   ├── pedidosControllers.js
│       │   ├── dashboardControllers.js
│       │   └── movimentacoesControllers.js
│       ├── middlewares/
│       │   ├── authMiddleware.js
│       │   ├── adminMiddleware.js
│       │   └── uploadMiddleware.js
│       ├── routes/
│       │   └── ...
│       ├── services/
│       │   ├── movimentacaoService.js
│       │   └── uploadService.js
│       └── server.js
│
└── frontend/
    └── src/
        ├── app/
        ├── components/
        ├── hooks/
        ├── lib/
        ├── services/
        └── middleware.js
```

---

## ⚡ Controle de Estoque

O sistema realiza automaticamente, via **transações atômicas do Prisma**:

- Baixa no estoque ao criar itens de pedido
- Reposição ao cancelar pedidos
- Atualização inteligente ao alterar quantidades
- Validação de estoque insuficiente antes de confirmar

---

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 22.x
- Conta no MongoDB Atlas
- Conta no Cloudinary

### 1. Clone o repositório

```bash
git clone URL_DO_REPOSITORIO
cd projeto
```

### 2. Configure e rode o Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env`:

```env
DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/database"

JWT_SECRET=sua_chave_secreta_aqui

CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

PORT=3000
```

Execute os comandos do Prisma:

```bash
npx prisma generate
npx prisma db push
```

Inicie o servidor:

```bash
npm run dev
```

### 3. Configure e rode o Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📋 Scripts Disponíveis

### Backend
| Script | Função |
|---|---|
| `npm run dev` | Executa em modo desenvolvimento |
| `npm start` | Executa em produção |
| `npx prisma generate` | Gera o Prisma Client |
| `npx prisma db push` | Aplica o schema no banco |

### Frontend
| Script | Função |
|---|---|
| `npm run dev` | Executa em modo desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm start` | Executa o build gerado |

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos no curso de **Desenvolvimento de Software Multiplataforma — FATEC**.

---
