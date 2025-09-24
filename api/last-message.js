export default async function handler(req, res) {
  const { channelId, userId, limit } = req.query;

  if (!channelId || !userId) {
    return res.status(400).json({ error: "channelId ve userId gerekli!" });
  }

  const fetchLimit = limit ? parseInt(limit) : 50;

  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages?limit=${fetchLimit}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        },
      }
    );

    const messages = await response.json();

    const lastMsg = messages.find((msg) => msg.author.id === userId);

    if (!lastMsg) {
      return res.json({ message: "Bu kullanıcıdan mesaj bulunamadı." });
    }

    // JSON'da tüm önemli veriler
    const result = {
      id: lastMsg.id,
      content: lastMsg.content,
      author: {
        id: lastMsg.author.id,
        username: lastMsg.author.username,
        discriminator: lastMsg.author.discriminator,
        avatar: lastMsg.author.avatar
      },
      createdAt: lastMsg.timestamp,
      editedAt: lastMsg.edited_timestamp,
      channelId: lastMsg.channel_id,
      pinned: lastMsg.pinned,
      tts: lastMsg.tts,
      type: lastMsg.type,
      attachments: lastMsg.attachments.map(att => ({
        id: att.id,
        filename: att.filename,
        url: att.url,
        proxyUrl: att.proxy_url,
        contentType: att.content_type,
        size: att.size
      })),
      embeds: lastMsg.embeds,
      mentions: lastMsg.mentions.map(u => ({
        id: u.id,
        username: u.username,
        discriminator: u.discriminator,
        avatar: u.avatar
      })),
      mentionRoles: lastMsg.mention_roles,
      reactions: lastMsg.reactions || [],
      flags: lastMsg.flags,
      webhookId: lastMsg.webhook_id || null,
      searchedMessages: fetchLimit
    };

    return res.json(result);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
