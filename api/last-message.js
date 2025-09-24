import fetch from "node-fetch";

export default async function handler(req, res) {
  const { channelId, userId } = req.query;

  if (!channelId || !userId) {
    return res.status(400).json({ error: "channelId ve userId gerekli!" });
  }

  try {
    // Discord API'den son 50 mesajı alıyoruz
    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages?limit=50`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        },
      }
    );

    const messages = await response.json();

    // Kullanıcının son mesajını bul
    const lastMsg = messages.find((msg) => msg.author.id === userId);

    if (!lastMsg) {
      return res.json({ message: "Bu kullanıcıdan mesaj bulunamadı." });
    }

    return res.json({
      user: lastMsg.author.username,
      lastMessage: lastMsg.content,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
                                 }
