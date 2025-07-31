# TaskShare Backend 🎯

Backend da aplicação TaskShare - Sistema de gerenciamento colaborativo de tarefas desenvolvido como desafio técnico.

## 📋 Stack Técnica

- **Runtime:** Node.js 20
- **Linguagem:** TypeScript
- **Framework:** Express.js (puro)
- **ORM:** Prisma
- **Banco de dados:** PostgreSQL
- **Autenticação:** JWT
- **Containerização:** Docker + Docker Compose
- **Testes:** Mocha + Chai + Supertest
- **Linting:** ESLint + Prettier

## 🚀 Funcionalidades

- [x] Configuração base do projeto
- [x] Docker setup completo
- [x] Banco PostgreSQL configurado
- [x] Prisma ORM configurado
- [x] API básica funcionando
- [x] Health check endpoint
- [x] Sistema de autenticação (registro/login)
- [x] CRUD de listas de tarefas
- [x] CRUD de tarefas
- [x] Sistema de compartilhamento
- [x] Comentários em tarefas
- [x] Testes automatizados

## 🛠️ Instalação e Execução

### Pré-requisitos

- Docker e Docker Compose
- Node.js 20+ (opcional, para desenvolvimento local)

### 1. Clone do repositório

```bash
git clone https://github.com/LucasRafa13/taskshare
cd taskshare/backend
```

### 2. Configuração do ambiente

```bash
cp .env.example .env

nano .env
```

### 3. Execução com Docker (Recomendado)

```bash
docker compose up postgres -d

npm install
npx prisma generate
npx prisma migrate dev --name init

docker compose up app-dev
```

### 4. Execução local (Alternativa)

```bash
# Instalar dependências
npm install

# Configurar banco (Docker deve estar rodando)
npx prisma generate
npx prisma migrate dev

# Executar em modo desenvolvimento
npm run dev
```

## 📡 Endpoints Disponíveis

### Status da API

- `GET /api` - Informações gerais da API
- `GET /api/health` - Health check

### Autenticação

- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Dados do usuário logado

### Listas

- `GET /api/lists` - Listar todas as listas
- `POST /api/lists` - Criar nova lista
- `PUT /api/lists/:id` - Editar lista
- `DELETE /api/lists/:id` - Excluir lista
- `POST /api/lists/:id/share` - Compartilhar lista
- `DELETE /api/lists/:id/share/:userId` - Remover compartilhamento

### Tarefas

- `GET /api/lists/:listId/tasks` - Listar tarefas
- `POST /api/lists/:listId/tasks` - Criar tarefa
- `PUT /api/tasks/:id` - Editar tarefa
- `DELETE /api/tasks/:id` - Excluir tarefa
- `PATCH /api/tasks/:id/toggle` - Marcar/desmarcar como concluída

## 🗄️ Estrutura do Banco

### Modelos principais:

- **User** - Usuários do sistema
- **TaskList** - Listas de tarefas
- **Task** - Tarefas individuais
- **ListShare** - Compartilhamento de listas
- **Comment** - Comentários em tarefas
- **RefreshToken** - Tokens de autenticação

Ver detalhes completos em `prisma/schema.prisma`

## 🐳 Docker

### Serviços disponíveis:

- **postgres** - Banco PostgreSQL
- **app-dev** - Aplicação em modo desenvolvimento
- **app-prod** - Aplicação em modo produção
- **pgadmin** - Interface de administração do banco

### Comandos úteis:

```bash

# Subir aplicação inteira de uma vez ( Hot Reload )
docker compose up app-dev

# Subir apenas o banco
docker compose up postgres -d

# Produção
docker compose --profile production up app-prod

# PgAdmin (desenvolvimento)
docker compose --profile development up pgadmin

# Ver logs
docker compose logs app-dev

# Parar tudo
docker compose down

# Limpar volumes (⚠️ apaga dados)
docker compose down -v
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm run test

```

## 📊 Banco de Dados

### Comandos Prisma:

```bash
# Gerar cliente
npx prisma generate

# Rodar migrations
npx prisma migrate dev

# Reset do banco
npx prisma migrate reset

# Visualizar dados
npx prisma studio

# Push schema (só desenvolvimento)
npx prisma db push
```

### PgAdmin (Interface gráfica):

- **URL:** http://localhost:5050
- **Email:** admin@taskshare.com
- **Senha:** admin123

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build para produção
npm run start        # Iniciar produção
npm run test             # Executar testes
npm run lint         # Verificar código
npm run format       # Formatar código
```

## 🌐 Variáveis de Ambiente

Principais variáveis (ver `.env.example` para lista completa):

```bash
# Aplicação
NODE_ENV=development
PORT=3000

# Banco de dados
DATABASE_URL="postgresql://taskshare_user:taskshare_password@localhost:5432/taskshare"

# JWT
JWT_SECRET="sua-chave-secreta-aqui"
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
```

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/          # Configurações (banco, env)
│   ├── controllers/     # Controladores das rotas
│   ├── middleware/      # Middlewares (auth, validação)
│   ├── routes/          # Definição das rotas
│   ├── services/        # Lógica de negócio
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # Utilitários (JWT, hash)
│   ├── app.ts           # Configuração Express
│   └── server.ts        # Entrada da aplicação
├── prisma/
│   ├── schema.prisma    # Schema do banco
│   └── migrations/      # Histórico de migrations
├── tests/               # Testes automatizados
├── docker-compose.yml   # Orquestração Docker
├── Dockerfile           # Imagem Docker
└── README.md
```

## 🔒 Segurança

- Helmet.js para headers de segurança
- CORS configurado
- Senhas hasheadas com bcrypt
- JWT para autenticação
- Validação de entrada com Joi
- Rate limiting (a implementar)

## 📈 Monitoramento

- Health check em `/api/health`
- Logs estruturados com Morgan
- Métricas Docker
- Error tracking (a implementar)

## 🚀 Deploy

### Produção com Docker:

```bash
# Build da imagem
docker build -t taskshare-backend .

# Executar produção
docker compose --profile production up
```

### Variáveis importantes para produção:

- `NODE_ENV=production`
- `JWT_SECRET` (chave forte)
- `DATABASE_URL` (banco de produção)

## 👨‍💻 Desenvolvedor

Desenvolvido como desafio técnico para demonstrar habilidades em:

- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Docker
- Arquitetura REST

---
