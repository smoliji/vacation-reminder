import { SlackReminder } from '../domain/SlackReminder'
import { SlackSubscriber } from '../domain/SlackSubscriber'

export function sendSlackReminder(token: string, reminder: SlackReminder) {
  const sub = reminder.getSubscriber() as SlackSubscriber
  const channel = sub.getChannel()
  const message = reminder.getMessage()
  chatPostMessage(token, channel, message.text)
}

function chatPostMessage(token: string, channel: string, text: string) {
  postJson(
    'https://slack.com/api/chat.postMessage',
    JSON.stringify({
      text,
      channel,
    }),
    authorization(token)
  )
}

function authorization(token: string) {
  return { authorization: `Bearer ${token}` }
}

function postJson(url: string, data: string, headers?: any) {
  return UrlFetchApp.fetch(url, {
    contentType: 'application/json; charset=utf8',
    method: 'post',
    payload: data,
    headers: headers,
  })
}
