export default {
  secret: process.env.JWT_SECRET_KEY, // Agora acessa a variável de ambiente corretamente
  expiresIn: "24h",
};
