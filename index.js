const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

// Armazena o estado e dados das triagens em memória
const sessoes = {};

// Texto informativo dos tipos de violência
const MENSAGEM_VIOLENCIAS = 
`Seguem abaixo algumas informações e exemplos de tipos de violência contra as mulheres, para melhor te direcionar.

Exemplos de violência física: espancamento; atirar objetos; sacudir e apertar os braços; estrangulamento ou sufocamento; lesões com objetos cortantes ou perfurantes; ferimentos causados por queimaduras ou armas de fogo; tortura.

Exemplos de violência psicológica: ameaças; constrangimento; humilhação; manipulação; isolamento – proibir de estudar e viajar ou falar com amigos e parentes; vigilância constante; perseguição contumaz; insultos; chantagem; exploração; limitação do direito de ir e vir; ridicularização; tirar a liberdade de crença; distorcer e omitir fatos para deixar a mulher em dúvida sobre sua memória e sanidade.

Exemplos de violência sexual: estupro; obrigar a mulher a fazer atos sexuais que causam desconforto ou repulsa; impedir o uso de métodos contraceptivos ou forçar a mulher a abortar; forçar matrimônio, gravidez ou prostituição por meio de coação, chantagem, suborno ou manipulação; limitar ou anular el exercício dos direitos sexuais e reprodutivos da mulher.

Exemplos de violência patrimonial: controlar o dinheiro; deixar de pagar pensão alimentícia; destruição de documentos pessoais; furto, extorsão ou dano; estelionato; privar de bens, valores ou recursos econômicos; causar danos propositais a objetos da mulher ou dos quais ela goste.

Exemplos de violência moral: acusar a mulher de traição; emitir juízos morais sobre a conduta; fazer críticas mentirosas; expor a vida íntima; rebaixar a mulher por meio de xingamentos que incidem sobre a sua índole; desvalorizar a vítima pelo seu modo de vestir.

O que é Importunação Sexual: Qualquer ação de natureza sexual, sem uso de violência ou ameaça, que vise satisfazer o desejo sexual sem o consentimento da mulher.


Escolha uma das opções de violência que sofreu:

1 - Física
2 - Psicológica
3 - Sexual
4 - Patrimonial
5 - Moral
6 - Importunação Sexual

Digite apenas o número`;

async function conectarWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\n--- ESCANEE O QR CODE ABAIXO COM SEU WHATSAPP ---\n');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const devocaoReconectar = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Conexão fechada. Reconectando...', devocaoReconectar);
      if (devocaoReconectar) {
        conectarWhatsApp();
      }
    } else if (connection === 'open') {
      console.log('\n✅ WHATSAPP CONECTADO COM SUCESSO NO PROJETO ESCUDO ROSA!\n');
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg || !msg.message) return;

    // Identifica se a mensagem veio de uma interação no chat do próprio número
    const usuarioId = msg.key.remoteJid;
    const textoRecebido = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

    if (!textoRecebido) return;

    // EVITAR LOOP DE AUTO-RESPOSTA:
    // Se a mensagem contiver partes dos textos padrão que o próprio BOT envia, ignora!
    const textosDoBot = [
      'Eu sou a Clara, atendente virtual',
      '⚠️ *ATENÇÃO:* Se você está em perigo imediato',
      'Por favor nos informe seu CPF',
      'Seguem abaixo algumas informações e exemplos',
      'Obrigada pelas informações. O agente do outro lado'
    ];

    const ehMensagemDoBot = textosDoBot.some(texto => textoRecebido.includes(texto));
    if (ehMensagemDoBot) return;

    // LÓGICA DA TRIAGEM DO ESCUDO ROSA
    if (!sessoes[usuarioId]) {
      sessoes[usuarioId] = { etapa: 'PERIGO_IMEDIATO', dados: {} };

      const mensagemBoasVindas = 
`Eu sou a Clara, atendente virtual da Prefeitura de Montes Claros.

Você está conversando no canal de atendimento do Escudo Rosa.

Este é um ambiente seguro e protegido, onde você encontrará serviços de proteção às mulheres como CRAM, Guardiã dos Montes, Hospital Universitário Clemente de Faria e Delegacia da Mulher.

Você está em perigo imediato?
Por favor digite somente SIM ou NÃO`;

      await sock.sendMessage(usuarioId, { text: mensagemBoasVindas });
      return;
    }

    const sessao = sessoes[usuarioId];
    const textoLimpo = textoRecebido.trim().toUpperCase();
    let respostaBot = '';

    switch (sessao.etapa) {

      case 'PERIGO_IMEDIATO':
        if (textoLimpo === 'SIM') {
          sessao.dados.perigoImediato = true;
          sessao.etapa = 'IDADE';
          respostaBot = 
`⚠️ *ATENÇÃO:* Se você está em perigo imediato, acione o socorro agora!

Toque em um dos números abaixo para abrir a ligação no seu celular:

📞 *Polícia Militar:* tel:190
📞 *Guarda Municipal:* tel:153

--------------------------------------------------
Continuando nosso atendimento seguro por aqui:

Qual a sua Idade ?`;
        } else if (textoLimpo === 'NÃO' || textoLimpo === 'NAO') {
          sessao.dados.perigoImediato = false;
          sessao.etapa = 'IDADE';
          respostaBot = 'Qual a sua Idade ?';
        } else {
          respostaBot = 'Por favor digite somente SIM ou NÃO\n\nVocê está em perigo imediato?';
        }
        break;

      case 'IDADE':
        sessao.dados.idade = textoRecebido;
        sessao.etapa = 'CPF';
        respostaBot = 'Por favor nos informe seu CPF\nCaso não possa informar no momento digite apenas 0';
        break;

      case 'CPF':
        sessao.dados.cpf = textoRecebido;
        sessao.etapa = 'TIPO_VIOLENCIA';
        respostaBot = MENSAGEM_VIOLENCIAS;
        break;

      case 'TIPO_VIOLENCIA':
        const opcoes = {
          '1': 'Física',
          '2': 'Psicológica',
          '3': 'Sexual',
          '4': 'Patrimonial',
          '5': 'Moral',
          '6': 'Importunação Sexual'
        };

        if (opcoes[textoLimpo]) {
          sessao.dados.tipoViolencia = opcoes[textoLimpo];
          sessao.etapa = 'LOCALIZACAO';
          respostaBot = 'Por favor ja nos envie sua localização. ou nos informe seu endereço ou clique para compartilhar localização.';
        } else {
          respostaBot = 'Digite apenas o número referente ao tipo de violência (1 a 6).';
        }
        break;

      case 'LOCALIZACAO':
        sessao.dados.localizacao = textoRecebido;

        console.log('\n------------------------------------------');
        console.log('✅ TRIAGEM CONCLUÍDA - PROJETO ESCUDO ROSA');
        console.log('WhatsApp ID:', usuarioId);
        console.log('Dados Coletados:', sessao.dados);
        console.log('------------------------------------------\n');

        respostaBot = 'Obrigada pelas informações. O agente do outro lado vai assumir a conversa agora.';
        delete sessoes[usuarioId];
        break;

      default:
        delete sessoes[usuarioId];
        respostaBot = 'Sessão reiniciada. Envie uma nova mensagem para iniciar.';
    }

    await sock.sendMessage(usuarioId, { text: respostaBot });
  });
}

conectarWhatsApp();