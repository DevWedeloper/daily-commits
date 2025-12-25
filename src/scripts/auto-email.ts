import env from '~/env'
import { hasUserCommittedToday } from '~/services/commit-status'
import { sendEmail } from '~/services/send-email'

async function checkAndEmail() {
  const hasCommittedToday = await hasUserCommittedToday(env.GH_USERNAME)

  if (!hasCommittedToday) {
    await sendEmail()
  }
  else {
    console.log('Already committed today. Skipping automated email.')
  }
}

checkAndEmail()
