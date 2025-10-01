# 🏪 Sistema de Loja - Documentação Completa

## 📋 Visão Geral

Sistema completo de loja com **autenticação baseada em roles** (RBAC - Role-Based Access Control), onde apenas administradores podem cadastrar novos funcionários. O sistema inclui frontend React, backend Node.js/Express e integração com Supabase PostgreSQL.

---

## 🚀 Funcionalidades Implementadas

### ✅ **Sistema de Autenticação e Autorização**
- **Roles**: ADMIN e USER (funcionário)
- **Middleware de Autorização**: Proteção de rotas sensíveis
- **Validação Frontend e Backend**: Verificação dupla de permissões
- **Endpoint Específico**: `/api/usuarios/funcionario` para cadastro de funcionários

### ✅ **Backend (Node.js/Express)**
- **Arquitetura MVC**: Controllers, Services, Repositories, Models
- **Enum de Roles**: Sistema centralizado de gerenciamento de permissões
- **Middleware**: `requireAuth`, `requireAdmin` para proteção de rotas
- **Validação de Dados**: Verificação de integridade e permissões

### ✅ **Frontend (React)**
- **Dashboard Responsivo**: Interface completa de administração
- **Componente de Cadastro**: Modal para cadastro de funcionários
- **Integração com Context API**: Gerenciamento de estado do usuário
- **Verificação de Permissões**: Interface adaptável baseada no role

### ✅ **Database (Supabase)**
- **Row Level Security (RLS)**: Políticas de segurança a nível de banco
- **Relacionamentos**: Usuários → Produtos (foreign key)
- **Constraints**: Validação de roles e regras de negócio

---

## 🔧 Configuração e Instalação

### **1. Backend Setup**
```bash
cd Back-end
npm install express cors bcrypt supabase dotenv
```

### **2. Frontend Setup**
```bash
cd ../
npm install axios
```

### **3. Configuração do Supabase**

#### **3.1 Executar SQL Inicial**
```sql
-- 1. Criar tabelas
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100),
    descricao TEXT,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **3.2 Executar SQL de Atualizações** (usar arquivo `supabase-updates.sql`)
```sql
-- Aplicar todas as políticas RLS e funções de segurança
-- (Execute o arquivo supabase-updates.sql completo no Supabase)
```

### **4. Variáveis de Ambiente**
Criar `.env` no Back-end:
```env
SUPABASE_URL=sua_supabase_url
SUPABASE_KEY=sua_supabase_key
PORT=5000
```

---

## 🎯 Como Usar o Sistema

### **1. Iniciar o Backend**
```bash
cd Back-end
node serve.js
```
Servidor rodará em: `http://localhost:5000`

### **2. Iniciar o Frontend**
```bash
npm start
```
Aplicação rodará em: `http://localhost:3000`

### **3. Login no Sistema**
- **Admin**: Use credenciais de administrador
- **Usuário**: Use credenciais de funcionário

### **4. Cadastrar Funcionário (Apenas Admin)**
1. Fazer login como administrador
2. No dashboard, clicar em "Cadastrar Funcionário"  
3. Preencher formulário (nome, email, senha)
4. Funcionário será criado com role "USER"

---

## 🔐 Sistema de Permissões

### **Roles Disponíveis**
| Role | Permissões |
|------|------------|
| `ADMIN` | ✅ Criar usuários<br>✅ Cadastrar funcionários<br>✅ Gerenciar produtos<br>✅ Visualizar relatórios |
| `USER` | ❌ Criar usuários<br>❌ Cadastrar funcionários<br>✅ Gerenciar produtos próprios<br>✅ Visualizar dados básicos |

### **Endpoints Protegidos**
```javascript
// Apenas ADMIN
POST /api/usuarios              // Criar usuário
POST /api/usuarios/funcionario  // Cadastrar funcionário  
DELETE /api/usuarios/:id        // Deletar usuário

// Requer Autenticação
GET /api/usuarios              // Listar usuários
GET /api/usuarios/:id          // Buscar usuário
PUT /api/usuarios/:id          // Atualizar usuário
```

---

## 🧪 Testes

### **Testar Sistema de Autorização**
```bash
cd Back-end
node test-auth.js
```

### **Cenários de Teste**
1. ✅ Admin criando usuário comum
2. ✅ Admin cadastrando funcionário  
3. ❌ Usuário comum tentando criar usuário
4. ❌ Usuário comum tentando cadastrar funcionário
5. ✅ Ambos listando usuários

---

## 📁 Estrutura do Projeto

```
Loja/
├── Back-end/
│   ├── src/
│   │   ├── controllers/     # Lógica de controle
│   │   ├── services/        # Regras de negócio
│   │   ├── repositories/    # Acesso aos dados
│   │   ├── models/          # Modelos de dados
│   │   ├── routes/          # Definição de rotas
│   │   ├── middlewares/     # Middleware de autenticação
│   │   ├── utils/           # Utilitários e enums
│   │   └── config/          # Configurações
│   ├── serve.js            # Servidor principal
│   ├── test-auth.js        # Testes de autorização
│   └── supabase-updates.sql # Atualizações do banco
├── src/
│   ├── components/
│   │   ├── dashboard/       # Componentes do dashboard
│   │   └── contextApi/      # Context API
│   ├── pages/              # Páginas principais
│   └── style/              # Estilos CSS
└── public/                 # Arquivos públicos
```

---

## 🔧 Troubleshooting

### **Erro de CORS**
- Verificar se `cors()` está configurado no backend
- Checar se o frontend está rodando na porta correta

### **Erro de Autorização**
- Verificar se headers estão sendo enviados:
  ```javascript
  headers: {
    'user-id': user?.id,
    'user-role': user?.role,
    'user-email': user?.email
  }
  ```

### **Erro de Database**
- Executar `supabase-updates.sql` para aplicar políticas RLS
- Verificar se as tabelas foram criadas corretamente

### **Frontend não reconhece Admin**
- Verificar se AuthContext está fornecendo o role correto
- Confirmar se o usuário logado tem role 'ADMIN'

---

## 📊 Próximos Passos

### **Melhorias Futuras**
- [ ] Sistema de JWT tokens real
- [ ] Recuperação de senha
- [ ] Logs de auditoria
- [ ] Criptografia de dados sensíveis
- [ ] Testes automatizados
- [ ] Deploy em produção

### **Funcionalidades Adicionais**
- [ ] Múltiplos roles (Gerente, Vendedor, etc.)
- [ ] Permissões granulares por recurso
- [ ] Dashboard de analytics
- [ ] Sistema de notificações

---

## 🤝 Contribuição

Para contribuir com o projeto:

1. **Fork** o repositório
2. **Create** uma branch para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra** um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 📞 Suporte

Para dúvidas e suporte:
- 📧 **Email**: suporte@loja.com
- 💬 **Issues**: Abra uma issue no GitHub
- 📚 **Documentação**: Este README

---

**🎉 Sistema totalmente funcional com autenticação baseada em roles!**