# TaskShare API - Documentação Completa

## 📋 Informações Gerais

- **Base URL**: `http://localhost:3000/api`
- **Autenticação**: Bearer Token (JWT)
- **Content-Type**: `application/json`
- **Versão**: 1.0.0

## 🔐 Autenticação

Todas as rotas protegidas requerem um token JWT no header:

```
Authorization: Bearer <seu_token_aqui>
```

---

## 📚 Endpoints

### 🔑 Autenticação

#### Registrar Usuário

```http
POST /auth/register
```

**Body:**

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "minimo8chars"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "João Silva",
      "email": "joao@email.com",
      "createdAt": "2025-01-01T12:00:00.000Z"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  },
  "message": "Usuário registrado com sucesso"
}
```

#### Login

```http
POST /auth/login
```

**Body:**

```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Response (200):** Mesmo formato do registro

#### Perfil do Usuário

```http
GET /auth/me
```

🔒 **Requer autenticação**

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "João Silva",
    "email": "joao@email.com",
    "createdAt": "2025-01-01T12:00:00.000Z",
    "_count": {
      "ownedLists": 5,
      "sharedLists": 2
    }
  }
}
```

#### Renovar Token

```http
POST /auth/refresh
```

**Body:**

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

#### Logout

```http
POST /auth/logout
```

🔒 **Requer autenticação**

---

### 📝 Listas de Tarefas

#### Listar Todas as Listas

```http
GET /lists
```

🔒 **Requer autenticação**

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "list_id",
      "title": "Minha Lista",
      "description": "Descrição da lista",
      "color": "#FF5722",
      "isArchived": false,
      "ownerId": "user_id",
      "createdAt": "2025-01-01T12:00:00.000Z",
      "updatedAt": "2025-01-01T12:00:00.000Z",
      "owner": {
        "id": "user_id",
        "name": "João Silva",
        "email": "joao@email.com"
      },
      "_count": {
        "tasks": 10,
        "shares": 2
      },
      "permission": "OWNER"
    }
  ]
}
```

#### Criar Lista

```http
POST /lists
```

🔒 **Requer autenticação**

**Body:**

```json
{
  "title": "Nova Lista",
  "description": "Descrição opcional",
  "color": "#4CAF50"
}
```

#### Ver Lista Específica

```http
GET /lists/{id}
```

🔒 **Requer autenticação**

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "list_id",
    "title": "Minha Lista",
    "description": "Descrição da lista",
    "color": "#FF5722",
    "isArchived": false,
    "ownerId": "user_id",
    "createdAt": "2025-01-01T12:00:00.000Z",
    "updatedAt": "2025-01-01T12:00:00.000Z",
    "owner": {
      "id": "user_id",
      "name": "João Silva",
      "email": "joao@email.com"
    },
    "_count": {
      "tasks": 10
    },
    "permission": "OWNER",
    "shares": [
      {
        "id": "share_id",
        "userId": "other_user_id",
        "permission": "READ",
        "createdAt": "2025-01-01T12:00:00.000Z",
        "user": {
          "id": "other_user_id",
          "name": "Maria Silva",
          "email": "maria@email.com"
        }
      }
    ]
  }
}
```

#### Atualizar Lista

```http
PUT /lists/{id}
```

🔒 **Requer autenticação + permissão WRITE**

**Body:**

```json
{
  "title": "Título atualizado",
  "description": "Nova descrição",
  "color": "#2196F3"
}
```

#### Excluir Lista

```http
DELETE /lists/{id}
```

🔒 **Requer autenticação + ser proprietário**

#### Compartilhar Lista

```http
POST /lists/{id}/share
```

🔒 **Requer autenticação + ser proprietário**

**Body:**

```json
{
  "userId": "user_id_to_share",
  "permission": "READ"
}
```

**Permissões disponíveis:**

- `READ`: Visualizar lista e tarefas
- `WRITE`: Criar/editar/excluir tarefas

#### Remover Compartilhamento

```http
DELETE /lists/{id}/share/{userId}
```

🔒 **Requer autenticação + ser proprietário**

---

### ✅ Tarefas

#### Listar Tarefas de uma Lista

```http
GET /list/{listId}/tasks
```

🔒 **Requer autenticação + acesso à lista**

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "task_id",
      "title": "Comprar leite",
      "description": "Leite integral 1L",
      "completed": false,
      "priority": "HIGH",
      "dueDate": "2025-07-31T10:00:00.000Z",
      "listId": "list_id",
      "position": 1,
      "createdAt": "2025-01-01T12:00:00.000Z",
      "updatedAt": "2025-01-01T12:00:00.000Z",
      "_count": {
        "comments": 3
      }
    }
  ]
}
```

#### Criar Tarefa

```http
POST /list/{listId}/tasks
```

🔒 **Requer autenticação + permissão WRITE**

**Body:**

```json
{
  "title": "Nova tarefa",
  "description": "Descrição opcional",
  "priority": "MEDIUM",
  "dueDate": "2025-12-31T23:59:59.000Z",
  "position": 1
}
```

**Prioridades disponíveis:**

- `LOW`: Baixa
- `MEDIUM`: Média (padrão)
- `HIGH`: Alta
- `URGENT`: Urgente

#### Ver Tarefa Específica

```http
GET /task/{id}
```

🔒 **Requer autenticação + acesso à lista**

#### Atualizar Tarefa

```http
PUT /task/{id}
```

🔒 **Requer autenticação + permissão WRITE**

**Body:** Mesmo formato da criação (todos os campos opcionais)

#### Marcar/Desmarcar como Concluída

```http
PATCH /task/{id}/toggle
```

🔒 **Requer autenticação + permissão WRITE**

#### Excluir Tarefa

```http
DELETE /task/{id}
```

🔒 **Requer autenticação + permissão WRITE**

#### Reordenar Tarefas

```http
PATCH /list/{listId}/reorder
```

🔒 **Requer autenticação + permissão WRITE**

**Body:**

```json
{
  "taskIds": ["task1_id", "task2_id", "task3_id"]
}
```

---

### 💬 Comentários

#### Listar Comentários de uma Tarefa

```http
GET /task/{taskId}/comments
```

🔒 **Requer autenticação + acesso à tarefa**

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "comment_id",
      "content": "Lembrar de comprar leite desnatado",
      "taskId": "task_id",
      "userId": "user_id",
      "createdAt": "2025-01-01T12:00:00.000Z",
      "updatedAt": "2025-01-01T12:00:00.000Z",
      "user": {
        "id": "user_id",
        "name": "João Silva",
        "email": "joao@email.com"
      }
    }
  ]
}
```

#### Criar Comentário

```http
POST /task/{taskId}/comments
```

🔒 **Requer autenticação + acesso à tarefa**

**Body:**

```json
{
  "content": "Meu comentário sobre a tarefa"
}
```

#### Atualizar Comentário

```http
PUT /comment/{id}
```

🔒 **Requer autenticação + ser autor do comentário**

**Body:**

```json
{
  "content": "Comentário atualizado"
}
```

#### Excluir Comentário

```http
DELETE /comment/{id}
```

🔒 **Requer autenticação + (ser autor OU proprietário da lista)**

---

## 🔧 Utilitários

#### Health Check

```http
GET /health
```

**Response (200):**

```json
{
  "status": "OK",
  "message": "TaskShare API Health Check",
  "timestamp": "2025-01-01T12:00:00.000Z",
  "environment": "development",
  "version": "1.0.0",
  "uptime": {
    "seconds": 3600,
    "human": "1h 0m 0s"
  },
  "database": {
    "status": "connected"
  },
  "memory": {
    "used": 128,
    "total": 256,
    "unit": "MB"
  }
}
```

#### Informações da API

```http
GET /
```

---

## 📋 Códigos de Erro

| Código | Descrição                                         |
| ------ | ------------------------------------------------- |
| 400    | Bad Request - Dados inválidos                     |
| 401    | Unauthorized - Token inválido/expirado            |
| 403    | Forbidden - Permissão insuficiente                |
| 404    | Not Found - Recurso não encontrado                |
| 409    | Conflict - Dados duplicados (ex: email já existe) |
| 500    | Internal Server Error - Erro interno              |

**Formato de Erro:**

```json
{
  "success": false,
  "error": "Mensagem do erro",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

---

## 🔐 Sistema de Permissões

### Listas

- **OWNER**: Pode fazer tudo (editar, excluir, compartilhar)
- **WRITE**: Pode criar/editar/excluir tarefas e comentários
- **READ**: Pode apenas visualizar

### Tarefas

- Herdam permissões da lista pai
- Criação/edição requer permissão WRITE na lista

### Comentários

- Criação requer acesso à tarefa
- Edição apenas pelo autor
- Exclusão pelo autor OU proprietário da lista

---

## 📝 Exemplos de Uso

### Fluxo Completo

```bash
# 1. Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@email.com","password":"senha123"}'

# 2. Criar lista
curl -X POST http://localhost:3000/api/lists \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Compras","color":"#4CAF50"}'

# 3. Criar tarefa
curl -X POST http://localhost:3000/api/list/LIST_ID/tasks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Comprar leite","priority":"HIGH"}'

# 4. Adicionar comentário
curl -X POST http://localhost:3000/api/task/TASK_ID/comments \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Lembrar: leite desnatado"}'
```

---

## 🏗️ Arquitetura

### Stack Técnica

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Linguagem**: TypeScript
- **ORM**: Prisma
- **Banco**: PostgreSQL
- **Autenticação**: JWT
- **Containerização**: Docker

### Estrutura de Pastas

```
src/
├── config/          # Configurações (DB, env)
├── controllers/     # Controladores HTTP
├── middleware/      # Middlewares (auth, validação)
├── routes/          # Definição de rotas
├── services/        # Lógica de negócio
├── types/           # Tipos TypeScript
└── utils/           # Utilitários
```

### Padrões Utilizados

- **Repository Pattern**: Isolamento da lógica de banco
- **Dependency Injection**: Inversão de controle
- **Error Handling**: Tratamento centralizado
- **Validation**: Joi para validação de entrada
- **Security**: Helmet, CORS, JWT
