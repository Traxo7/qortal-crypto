import PaymentTransaction from './PaymentTransaction.js'
import MessageTransaction from './MessageTransaction.js'
import RegisterNameTransaction from './names/RegisterNameTransaction.js'
import ChatTransaction from './chat/ChatTransaction.js'
import GroupChatTransaction from './chat/GroupChatTransaction.js';
import RewardShareTransaction from './RewardShareTransaction.js'
import CreateGroupTransaction from './groups/CreateGroupTransaction.js';
import JoinGroupTransaction from './groups/JoinGroupTransaction.js'
import PublicizeTransaction from './PublicizeTransaction.js'

export const transactionTypes = {
    2: PaymentTransaction,
    3: RegisterNameTransaction,
    17: MessageTransaction,
    18: ChatTransaction,
    181: GroupChatTransaction,
    19: PublicizeTransaction,
    22: CreateGroupTransaction,
    31: JoinGroupTransaction,
    38: RewardShareTransaction
}
