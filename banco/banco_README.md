
# Banco de Dados - Desafio Técnico

Este diretório contém o script SQL utilizado para criar o banco de dados e suas tabelas no sistema de reservas.

## Requisitos

- MySQL ou MariaDB instalado
- Acesso ao terminal ou interface de administração (como phpMyAdmin, DBeaver, MySQL Workbench etc.)

## Como Importar o Banco

1. Abra seu terminal ou ferramenta de administração de banco de dados.
2. Execute o script `banco.sql` contido neste diretório.

```bash
mysql -u root -p reservas < banco.sql
```

> Altere o nome do usuário (`root`) ou banco (`reservas`) conforme sua configuração.

## Estrutura do Banco

O banco de dados contém as seguintes tabelas:

- `clientes` — Armazena os dados dos clientes
- `locacoes` — Tipos de locações disponíveis
- `reservas` — Informações sobre reservas realizadas

## Observações

- Certifique-se de que a porta e credenciais do MySQL estejam corretas no `.env` do backend.
- O banco padrão utilizado é `reservas`, mas isso pode ser alterado conforme necessário.
