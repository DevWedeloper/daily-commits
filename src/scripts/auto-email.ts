import { hasUserCommittedToday } from '../services/commit-status';
import { sendEmail } from '../services/send-email';

const checkAndEmail = async () => {
  const hasCommittedToday = await hasUserCommittedToday('DevWedeloper');

  if (!hasCommittedToday) {
    await sendEmail();
  } else {
    console.log('Already committed today. Skipping automated email.');
  }
};

checkAndEmail();
