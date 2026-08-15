// Exemplo conceitual da trava no Controller
exports.handleWebhook = async (req, res) => {
  // 1. Responde a API IMEDIATAMENTE com status 200 para evitar retentativas
  res.status(200).json({ status: 'received' });

  const { data } = req.body;

  // 2. Trava de Segurança: Ignora mensagens enviadas pelo próprio BOT!
  if (data.key.fromMe) {
    return; // Para o processamento aqui
  }

  // 3. Encaminha para o botEngine apenas se for mensagem de um CLIENTE
  await botEngineService.processMessage(data);
};