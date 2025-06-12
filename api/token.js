// api/token.js

const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

module.exports = (req, res) => {
  const appID = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

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
};
