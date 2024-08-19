import { BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import { StoreContract, StoreCreated as StoreCreatedEvent } from "../generated/StoreContract/StoreContract"
import { PaymentContract, PaymentProcessed as PaymentProcessedEvent } from "../generated/PaymentContract/PaymentContract"
import { Store, Merchant, Payment } from "../generated/schema"

export function handleStoreCreated(event: StoreCreatedEvent): void {
  log.info('Handling StoreCreated event. Merchant: {}, StoreId: {}', [
    event.params.merchant.toHexString(),
    event.params.storeId.toString()
  ])

  let merchantId = event.params.merchant
  let storeId = merchantId.toHexString() + '-' + event.params.storeId.toString()

  let merchant = Merchant.load(merchantId)
  if (merchant == null) {
    merchant = new Merchant(merchantId)
    merchant.isRegistered = true
    merchant.isPremium = false
    merchant.storeCount = BigInt.fromI32(0)
  }

  let store = new Store(storeId)
  let contract = StoreContract.bind(event.address)

  store.storeId = event.params.storeId
  store.merchant = merchantId
  store.transactionCount = BigInt.fromI32(0)
  store.transactionVolume = BigInt.fromI32(0)
  store.createdAt = event.block.timestamp

  // Handle acceptedTokens
  let acceptedTokensResult = contract.try_viewStoreTokenAccepted(merchantId, event.params.storeId)
  if (acceptedTokensResult.reverted) {
    store.acceptedTokens = []
  } else {
    let tokens = acceptedTokensResult.value
    let tokenStrings: string[] = []
    for (let i = 0; i < tokens.length; i++) {
      tokenStrings.push(tokens[i].toHexString())
    }
    store.acceptedTokens = tokenStrings
  }

  merchant.storeCount = merchant.storeCount.plus(BigInt.fromI32(1))

  store.save()
  merchant.save()

  log.info('Store saved. ID: {}', [store.id])}

export function handlePaymentProcessed(event: PaymentProcessedEvent): void {
  let paymentId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  let storeId = event.params.merchant.toHexString() + '-' + event.params.storeId.toString()

  let store = Store.load(storeId)
  if (store == null) {
    log.error("Store not found for payment. StoreId: {}", [storeId])
    return
  }

  let merchant = Merchant.load(event.params.merchant)
  if (merchant == null) {
    log.error("Merchant not found for payment. Merchant address: {}", [event.params.merchant.toHexString()])
    return
  }

  let payment = new Payment(paymentId)
  payment.client = event.params.client
  payment.merchant = event.params.merchant
  payment.store = storeId
  payment.token = event.params.token
  payment.amount = event.params.amount
  payment.fee = event.params.fee
  payment.usdtEquivalent = event.params.usdtEquivalent
  payment.timestamp = event.block.timestamp

  payment.save()

  // Update store statistics
  store.transactionCount = store.transactionCount.plus(BigInt.fromI32(1))
  store.transactionVolume = store.transactionVolume.plus(event.params.usdtEquivalent)
  store.save()

  log.info('Payment processed. ID: {}, Store: {}, Amount: {}', [paymentId, storeId, event.params.amount.toString()])
}