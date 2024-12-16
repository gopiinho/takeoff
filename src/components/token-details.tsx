'use client'
import { useState } from 'react'
import { Address } from 'viem'
import { useWriteContract, useAccount } from 'wagmi'
import abi from '@/utils/abis/token-factory.json'
import { requiredValue, factoryContractAddress } from '@/utils/constants'
// import { MdFileUpload } from 'react-icons/md'

interface CreateCoinProps {
  name: string
  ticker: string
  description: string
  image: string
  account: Address | undefined
}

export default function TokenDetails() {
  const [formData, setFormData] = useState({
    name: '',
    ticker: '',
    description: '',
    image: '',
  })
  // const [fileName, setFileName] = useState('')
  // const [filePreview, setFilePreview] = useState<string | null>(null)
  // const [error, setError] = useState('')
  // const [file, setFile] = useState<File>()
  // const [url, setUrl] = useState('')
  // const [uploading, setUploading] = useState(false)

  const { writeContractAsync } = useWriteContract()
  const { address } = useAccount()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (!file) return
  //   // Validate file size (max 2MB)
  //   if (file.size > 2 * 1024 * 1024) {
  //     setError('File size must not exceed 2MB.')
  //     setFilePreview(null)
  //     setFileName('')
  //     return
  //   }
  //   setError('')
  //   setFileName(file.name)
  //   const previewURL = URL.createObjectURL(file)
  //   setFilePreview(previewURL)
  //   setFile(event.target?.files?.[0])
  // }

  // const uploadFile = async (): Promise<string> => {
  //   if (!file) {
  //     throw new Error('No file selected')
  //   }

  //   try {
  //     setUploading(true)

  //     const data = new FormData()
  //     data.set('file', file)

  //     const uploadRequest = await fetch('/api/files', {
  //       method: 'POST',
  //       body: data,
  //     })

  //     const ipfsUrl: string = await uploadRequest.json()

  //     if (!ipfsUrl) {
  //       throw new Error('File upload failed: No URL returned')
  //     }

  //     setUrl(ipfsUrl)
  //     return ipfsUrl
  //   } catch (error) {
  //     console.error('Error uploading file:', error)
  //     throw new Error('Trouble uploading file')
  //   } finally {
  //     setUploading(false)
  //   }
  // }
  async function createCoin({ name, ticker, description, image, account }: CreateCoinProps) {
    try {
      const args = [name, ticker, description, image]

      const transaction = await writeContractAsync({
        abi: abi,
        address: factoryContractAddress,
        functionName: 'createToken',
        args: args,
        account: account,
        value: BigInt(requiredValue),
      })

      console.log('Transaction successful:', transaction)
      return transaction
    } catch (error) {
      console.error('Error while creating coin:', error)
      throw error
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6 w-full sm:max-w-[30%] mx-auto">
      <div className="flex flex-col text-start gap-1">
        <span className="font-semibold text-purple-500">name</span>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="min-h-10 rounded-md text-black py-1 px-2 bg-[#312936] border border-white/80 text-white/80"
        />
      </div>
      <div className="flex flex-col text-start gap-1">
        <span className="font-semibold text-purple-500">ticker</span>
        <input
          type="text"
          name="ticker"
          value={formData.ticker}
          onChange={handleChange}
          className="min-h-10 rounded-md text-black py-1 px-2 bg-[#312936] border border-white/80 text-white/80"
        />
      </div>
      <div className="flex flex-col text-start gap-1">
        <span className="font-semibold text-purple-500">description</span>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="min-h-24 rounded-md text-black py-1 px-2 bg-[#312936] border border-white/80 text-white/80"
        />
      </div>
      <div className="flex flex-col text-start gap-1">
        <span className="font-semibold text-purple-500">image link</span>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="min-h-10 rounded-md text-black py-1 px-2 bg-[#312936] border border-white/80 text-white/80"
        />
      </div>
      {/* TODO: add image upload */}
      {/* <div className="flex flex-col text-start gap-1">
        <span className="font-semibold text-purple-500">image or video</span>
        <div className="w-full p-4 rounded-md border border-white flex flex-col items-center justify-center text-center gap-2">
          {!filePreview ? <MdFileUpload size={30} /> : null}
          <div className="flex flex-col items-center space-y-4">
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={handleFileChange}
            />
            {filePreview && (
              <div className="mt-4">
                <img src={filePreview} alt="Preview" className="w-44 h-44 object-cover rounded-md shadow-md" />
              </div>
            )}
            {error ? (
              <span className="text-red-500 text-sm">{error}</span>
            ) : (
              fileName && <span className="text-gray-500 text-sm">{fileName}</span>
            )}
            <label
              htmlFor="avatar"
              className="cursor-pointer px-4  border border-white text-white hover:border-white/60 hover:text-white/60"
            >
              {filePreview ? 'select another file' : 'select file'}
            </label>

            <button type="button" disabled={uploading} onClick={uploadFile} className="border border-white px-2">
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div> */}
      <button
        className="py-2 px-5 bg-purple-500 hover:bg-purple-600 rounded-md font-semibold my-2"
        onClick={() =>
          createCoin({
            name: formData.name,
            ticker: formData.ticker,
            description: formData.description,
            image: formData.image,
            account: address,
          }).catch((err) => console.error('Failed to create coin:', err))
        }
      >
        create coin
      </button>
    </div>
  )
}
