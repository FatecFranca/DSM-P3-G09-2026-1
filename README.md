# DSM-P3-G09-2026-1
Repositório do GRUPO 09 do Projeto Interdisciplinar do 3º semestre DSM 2026/1. Alunos: Guilherme Porto de Melo Junqueira, Leonardo Centeno Bonamin.

# Sistema de Controle de Estoque e Pedidos

## Sobre o Projeto

Este projeto é uma API REST desenvolvida para gerenciamento de:

* Produtos
* Clientes
* Fornecedores
* Pedidos
* Itens de Pedido
* Movimentações de Estoque
* Dashboard gerencial
* Upload de imagens de produtos

O sistema foi desenvolvido utilizando Node.js, Express, Prisma ORM e MongoDB, seguindo uma arquitetura organizada em controllers, routes e services.

---

# Tecnologias Utilizadas

* Node.js
* Express
* Prisma ORM 6
* MongoDB
* Cloudinary (upload de imagens)
* Multer
* Dotenv

---

# Versões Utilizadas

| Tecnologia | Versão |
| ---------- | ------ |
| Node.js    | 22.x   |
| Prisma     | 6.x    |
| MongoDB    | Atlas  |
| Express    | 5.x    |

---

# Estrutura do Projeto

```text
backend/
│
├── prisma/
│   ├── schema.prisma
│
├── src/
│   ├── controllers/
│   │   ├── clientesControllers.js
│   │   ├── fornecedoresControllers.js
│   │   ├── produtosControllers.js
│   │   ├── pedidosControllers.js
│   │   ├── dashboardControllers.js
│   │   └── movimentacoesControllers.js
│   │
│   ├── routes/
│   │   ├── clientesRoutes.js
│   │   ├── fornecedoresRoutes.js
│   │   ├── produtosRoutes.js
│   │   ├── pedidosRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── movimentacoesRoutes.js
│   │
│   ├── services/
│   │   ├── movimentacaoService.js
│   │   └── uploadService.js
│   │
│   ├── middlewares/
│   │   └── uploadMiddleware.js
│   │
│   ├── config/
│   │   └── cloudinary.js
│   │
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

# Funcionalidades

## Produtos

* Cadastro
* Atualização
* Exclusão
* Controle de estoque
* Upload de imagens
* Associação com fornecedores

---

## Clientes

* Cadastro
* Atualização
* Consulta
* Exclusão
* Histórico de pedidos

---

## Fornecedores

* Cadastro
* Atualização
* Consulta
* Exclusão
* Associação com produtos

---

## Pedidos

* Criação de pedidos
* Adição de itens
* Atualização automática do valor total
* Controle automático de estoque
* Cancelamento de pedidos

---

## Movimentações

* Entrada de estoque
* Saída de estoque
* Cancelamento de saída
* Histórico de movimentações

---

# Controle de Estoque

O sistema realiza automaticamente:

* Baixa no estoque ao criar itens de pedido
* Reposição ao cancelar pedidos
* Atualização inteligente ao alterar quantidades
* Validação de estoque insuficiente

Tudo utilizando transações atômicas com Prisma.

---

# Instalação do Projeto

## 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

---

## 2. Entrar na pasta

```bash
cd backend
```

---

## 3. Instalar dependências

```bash
npm install
```

---

# Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto.

## Exemplo

```env
DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/database"

CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

PORT=3000
```

---

# Gerar Prisma Client

```bash
npx prisma generate
```

---

# Atualizar Banco de Dados

MongoDB não utiliza migrations SQL tradicionais.

Após ajustar o schema:

```bash
npx prisma db push
```

---

# Executar o Projeto

## Desenvolvimento

```bash
npm run dev
```

---

## Produção

```bash
npm start
```

---

# Upload de Imagens

As imagens dos produtos são armazenadas em nuvem utilizando Cloudinary.

O sistema salva apenas a URL da imagem no banco de dados.

---

# Dashboard

O sistema possui endpoints para:

* Pedidos recentes
* Produtos em estoque crítico
* Quantidade de produtos
* Quantidade de clientes
* Quantidade de fornecedores
* Pedidos do mês

---

# Padrões Utilizados

* Arquitetura em camadas
* Services para regras de negócio
* Controllers para requisições HTTP
* Transactions do Prisma
* Separação de responsabilidades
* Validação de estoque
* Controle automático de movimentações

---

# Scripts Disponíveis

| Script              | Função                     |
| ------------------- | -------------------------- |
| npm run dev         | Executa em desenvolvimento |
| npm start           | Executa em produção        |
| npx prisma generate | Gera Prisma Client         |
| npx prisma db push  | Atualiza schema no banco   |

---

# Melhorias Futuras

* Autenticação JWT
* Controle de permissões
* Logs de auditoria
* Paginação
* Relatórios PDF
* Dashboard em tempo real
* Testes automatizados
* Docker

---

# Autor

## Guilherme Porto de melo Junqueira
## Leonardo Centeno Bonamin

Projeto desenvolvido para fins acadêmicos e aprendizado em desenvolvimento backend com Node.js, Prisma ORM e MongoDB.
