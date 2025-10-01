# 📱 Acesso Mobile - LimpaTech Loja

## Para acessar do celular:

### 1. Verificar se estão na mesma rede Wi-Fi
- PC e celular devem estar conectados na mesma rede Wi-Fi

### 2. URLs para acesso:
- **Página da Loja (Pública)**: http://192.168.1.4:3000
- **Dashboard Admin**: http://192.168.1.4:3000/dashboard

### 3. Como iniciar o projeto:
1. Execute o arquivo `start-projeto.bat` OU
2. Execute manualmente:
   ```bash
   # Terminal 1 - Back-end
   cd Back-end
   node serve.js
   
   # Terminal 2 - Front-end  
   npm start
   ```

### 4. Páginas disponíveis:
- **Loja** (`/`): Acesso público, qualquer pessoa pode ver os produtos
- **Dashboard** (`/dashboard`): Requer login (admin ou usuário)

### 5. Solução de problemas:
- Se não conseguir acessar do celular:
  1. Verifique se estão na mesma rede Wi-Fi
  2. Verifique se o firewall não está bloqueando
  3. Tente desabilitar temporariamente o antivírus
  4. Confirme se o IP está correto: `ipconfig` no CMD

### 6. Login de teste:
- **Admin**: admin@limpatech.com / admin123
- **Usuário**: user@limpatech.com / user123