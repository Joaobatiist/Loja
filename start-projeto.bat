@echo off
echo Iniciando Loja LimpaTech...
echo.

echo [1/2] Iniciando Back-end na porta 3001...
start /b cmd /c "cd /d C:\Users\joaov\.vscode\Loja\Back-end && node serve.js"
timeout /t 3 /nobreak >nul

echo [2/2] Iniciando Front-end na porta 3000...
echo.
echo Aguarde alguns segundos...
echo.
echo Acesse no PC: http://localhost:3000
echo Acesse no celular: http://192.168.1.4:3000
echo.

cd /d "C:\Users\joaov\.vscode\Loja"
npm start