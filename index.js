// Only load .env in development mode
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/token', (req, res) => {
  const appID = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  console.log('AGORA_APP_ID:', appID ? '✅ loaded' : '❌ missing');
  console.log('AGORA_APP_CERTIFICATE:', appCertificate ? '✅ loaded' : '❌ missing');

  const channelName = req.query.channel;
  const uid = req.query.uid || 0;
  const role = RtcRole.PUBLISHER;
  const expireTime = 3600;

  if (!channelName) {
    return res.status(400).json({ error: 'channel name is required' });
  }

  if (!appID || !appCertificate) {
    return res.status(500).json({ error: 'Agora app credentials are missing' });
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpireTime
    );

    return res.json({ token });
  } catch (err) {
    console.error('Error generating token:', err);
    return res.status(500).json({ error: 'Failed to generate token' });
  }
});

app.listen(PORT, () => {
  console.log(`Agora Token Server running at http://localhost:${PORT}`);
});