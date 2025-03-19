import { hasUserCommittedToday } from '../services/commit-status';
import { sendEmail } from '../services/send-email';

const checkAndEmail = async () => {
  const hasComittedToday = await hasUserCommittedToday('DevWedeloper');

  if (!hasComittedToday) {
    await sendEmail();
  } else {
    console.log('Already committed today. Skipping automated email.');
  }
};

checkAndEmail();
