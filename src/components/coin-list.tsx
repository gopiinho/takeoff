import CoinDetails from './coin-details'

const image = 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=040'
const creator = '0x1234567890123456789012345678901234567890'
const raised = 24
const name = 'Bitcoin'
const ticker = 'BTC'
const description =
  'Based on a free-market ideology, bitcoin was invented in 2008 by Satoshi Nakamoto, an unknown person. Use of bitcoin as a currency began in 2009, with the release of its open-source implementation. In 2021, El Salvador adopted it as legal tender.'

export default function CoinList() {
  return (
    <div className="grid grid-cols-3 px-10 max-sm:px-2">
      <CoinDetails
        image={image}
        creator={creator}
        raised={raised}
        name={name}
        ticker={ticker}
        description={description}
      />
      <CoinDetails
        image={image}
        creator={creator}
        raised={raised}
        name={name}
        ticker={ticker}
        description={description}
      />{' '}
      <CoinDetails
        image={image}
        creator={creator}
        raised={raised}
        name={name}
        ticker={ticker}
        description={description}
      />{' '}
      <CoinDetails
        image={image}
        creator={creator}
        raised={raised}
        name={name}
        ticker={ticker}
        description={description}
      />{' '}
      <CoinDetails
        image={image}
        creator={creator}
        raised={raised}
        name={name}
        ticker={ticker}
        description={description}
      />
    </div>
  )
}
