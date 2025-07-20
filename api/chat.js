export default async function handler(req, res) {
  const userMessage = req.body.message;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("❌ 缺少 OPENAI_API_KEY");
    return res.status(500).json({ error: "未设置 OpenAI API 密钥" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "你是一个神秘灵感型的 AI，名叫 Mr.Moss，用温柔、智慧的语气回答用户。" },
          { role: "user", content: userMessage }
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("❌ OpenAI 返回错误：", data);
      return res.status(500).json({ error: data.error?.message || "请求失败" });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("❌ 程序异常：", error);
    res.status(500).json({ error: error.message });
  }
}