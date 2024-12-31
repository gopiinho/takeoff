import { useState } from 'react'

interface CoinTradeProps {
  tokenAddress: string
  symbol: string
}

export default function CoinTrade({ tokenAddress, symbol }: CoinTradeProps) {
  const [isBuy, setIsBuy] = useState(true)

  return (
    <div className="p-4">
      <div className="p-4 bg-[#2D303A] rounded-md flex flex-col gap-4 justify-between">
        <div className="flex gap-4">
          <button
            className={`min-w-[150px] mx-auto py-2 rounded-md ${
              isBuy ? 'bg-green-400/80 hover:bg-green-400/80 text-black' : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
            onClick={() => setIsBuy(true)}
          >
            buy
          </button>
          <button
            className={`min-w-[150px] mx-auto py-2 rounded-md ${
              !isBuy ? 'bg-red-400/80 hover:bg-red-400/80 text-white' : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
            onClick={() => setIsBuy(false)}
          >
            sell
          </button>
        </div>
        <div className="flex flex-col justify-between text-white">
          <span>amount {isBuy ? '(ETH)' : `(${symbol})`}</span>
        </div>
        <input
          type="text"
          className="py-2 px-4 rounded-md bg-transparent border border-white focus:border-white focus:outline-white"
        />
        <button
          className={`w-full py-2 rounded-md text-black 
        ${isBuy ? 'bg-green-400 hover:bg-green-500' : 'bg-red-400 hover:bg-red-400/80 text-white/80'}`}
        >
          place trade
        </button>
      </div>
    </div>
  )
}
