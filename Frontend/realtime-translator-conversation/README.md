# Tradutor em Tempo Real para Teams e Google Meet

Este projeto fornece uma solução de tradução em tempo real que funciona com Microsoft Teams e Google Meet. A aplicação traduz automaticamente as conversas entre português e inglês em tempo real, permitindo que pessoas que falam idiomas diferentes possam se comunicar fluidamente.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

1. **Backend API (.NET 8)**: Fornece serviços de tradução e comunicação em tempo real
2. **Frontend (React + TypeScript)**: Interface do usuário para interação com os serviços de tradução

## Requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Uma conta Azure com acesso ao [Azure Speech Services](https://azure.microsoft.com/services/cognitive-services/speech-services/)

## Configuração do Backend

1. Clone o repositório
2. Navegue até a pasta da API
3. Atualize o arquivo `appsettings.json` com suas credenciais do Azure:
   ```json
   "Azure": {
     "SpeechKey": "sua-chave-do-azure-speech",
     "SpeechRegion": "sua-região-do-azure"
   }
   ```
4. Execute os seguintes comandos:
   ```bash
   dotnet restore
   dotnet build
   dotnet run
   ```
5. A API estará disponível em `https://localhost:7071`

## Configuração do Frontend

1. Navegue até a pasta do frontend
2. Crie um arquivo `.env` com o seguinte conteúdo:
   ```
   REACT_APP_API_URL=https://localhost:7071/api
   REACT_APP_SIGNALR_URL=https://localhost:7071/hubs/translation
   ```
3. Execute os seguintes comandos:
   ```bash
   npm install
   npm start
   ```
4. A aplicação estará disponível em `http://localhost:3000`

## Uso da Aplicação

1. Abra a aplicação no navegador
2. Selecione os idiomas de origem e destino
3. Clique no botão "Iniciar Gravação" para começar a capturar áudio
4. Fale no microfone e veja a tradução em tempo real
5. Você também pode digitar texto para tradução na caixa de texto

## Integração com Teams/Google Meet

### Microsoft Teams
Para integrar com o Microsoft Teams:
1. Use a aplicação em uma janela separada durante chamadas do Teams
2. Para desenvolvimento de uma extensão completa, consulte [Microsoft Teams Developer Platform](https://developer.microsoft.com/microsoft-teams/)

### Google Meet
Para integrar com o Google Meet:
1. Use a aplicação em uma janela separada durante chamadas do Google Meet
2. Para desenvolvimento de uma extensão completa, consulte [Google Meet Add-ons](https://developers.google.com/workspace/add-ons/google-workspace/extend-meet)

## Estrutura de Diretórios

```
projeto/
├── api/                  # Backend .NET
│   ├── Controllers/      # Controladores da API
│   ├── Hubs/             # Hub SignalR para comunicação em tempo real
│   ├── Models/           # Modelos de dados
│   ├── Services/         # Serviços de tradução
│   └── Program.cs        # Configuração da aplicação
│
└── web/                  # Frontend React
    ├── public/           # Arquivos estáticos
    └── src/              # Código-fonte
        ├── components/   # Componentes React
        ├── contexts/     # Contextos React
        ├── hooks/        # Hooks personalizados
        ├── services/     # Serviços de API
        ├── types/        # Definições de tipos TypeScript
        └── utils/        # Funções utilitárias
```

## Funcionalidades

- Tradução bidirecional entre português e inglês
- Reconhecimento de fala em tempo real
- Tradução de texto em tempo real
- Síntese de fala para o texto traduzido
- Modo contínuo para tradução contínua
- Interface intuitiva e responsiva

## Considerações sobre Custos

O Azure Speech Services oferece uma camada gratuita que inclui:
- 5 horas de reconhecimento de fala por mês
- 5 milhões de caracteres de síntese de fala por mês
- 2 milhões de caracteres de tradução por mês

Para uso além desses limites, consulte a [página de preços do Azure](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

## Possíveis Melhorias Futuras

- Suporte a mais idiomas
- Integração direta como extensão do Teams/Meet
- Versão móvel nativa usando React Native
- Detecção automática de idioma
- Modo offline para tradução básica sem internet

## Solução de Problemas

- **Erro de conexão com a API**: Verifique se o backend está em execução e se as URLs no arquivo `.env` estão corretas
- **Problemas com microfone**: Verifique as permissões do navegador e certifique-se de que o microfone está funcionando corretamente
- **Erros de tradução**: Verifique suas credenciais do Azure e a região configurada

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).