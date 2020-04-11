import PaymentTransaction from './PaymentTransaction.js'
import MessageTransaction from './MessageTransaction.js'
import RegisterNameTransaction from './RegisterNameTransaction.js'
import DelegationTransaction from './DelegationTransaction.js'
import RewardShareTransaction from './RewardShareTransaction.js'
import RemoveRewardShareTransaction from './RemoveRewardShareTransaction.js'

export const transactionTypes = {
    2: PaymentTransaction,
    3: RegisterNameTransaction,
    17: MessageTransaction,
    18: DelegationTransaction,
    38: RewardShareTransaction,
    138: RemoveRewardShareTransaction
}
