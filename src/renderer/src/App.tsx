import { useState } from 'react'

// import testImg from './assets/testImg.jpeg'
interface SharpOptions {
  resize: {
    width: number
    height: number
    fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  }
  rotate: number
  format: 'jpeg' | 'png' | 'webp' | 'avif'
  quality: number
  flip: boolean
  flop: boolean
}

function App(): JSX.Element {
  const [options, setOptions] = useState<SharpOptions>({
    resize: {
      width: 800,
      height: 600,
      fit: 'cover'
    },
    rotate: 0,
    format: 'webp',
    quality: 80,
    flip: false,
    flop: false
  })

  const handleOptionChange = (category: keyof SharpOptions, value: any) => {
    setOptions((prev) => ({
      ...prev,
      [category]: value
    }))
  }
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const handleConvert = async (inputPath, format = 'webp') => {
    console.log(options)
    try {
      await window.api.convertImage({
        inputPath,
        format,
        options: options
      })
    } catch (error) {
      alert('Conversion failed: ' + (error as any)?.message)
    }
  }

  const handleOnDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files

    for (const file of files) {
      const newPath = await window.api.getFilePath(file)

      await handleConvert(newPath)
    }
  }

  const handleOnDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  // const handleOnDragStartImg = (event: React.DragEvent<HTMLDivElement>) => {
  //   event.preventDefault()
  //   window.api.startDrag('drag-and-drop.jpg')
  // }

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <div
          onDrop={handleOnDrop}
          onDragOver={handleOnDragOver}
          className="w-[200px] h-[100px] border border-green-500 flex justify-center items-center"
        >
          Drop zone
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Width</label>
            <input
              type="number"
              value={options.resize.width}
              onChange={(e) =>
                handleOptionChange('resize', {
                  ...options.resize,
                  width: parseInt(e.target.value)
                })
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Height</label>
            <input
              type="number"
              value={options.resize.height}
              onChange={(e) =>
                handleOptionChange('resize', {
                  ...options.resize,
                  height: parseInt(e.target.value)
                })
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Fit</label>
            <select
              value={options.resize.fit}
              onChange={(e) =>
                handleOptionChange('resize', {
                  ...options.resize,
                  fit: e.target.value
                })
              }
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
              <option value="inside">Inside</option>
              <option value="outside">Outside</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Format</label>
            <select
              value={options.format}
              onChange={(e) => handleOptionChange('format', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
              <option value="avif">AVIF</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rotation</label>
            <input
              type="range"
              min="0"
              max="360"
              value={options.rotate}
              onChange={(e) => handleOptionChange('rotate', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Quality</label>
            <input
              type="range"
              min="1"
              max="100"
              value={options.quality}
              onChange={(e) => handleOptionChange('quality', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.flip}
                onChange={(e) => handleOptionChange('flip', e.target.checked)}
                className="mr-2"
              />
              Flip
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.flop}
                onChange={(e) => handleOptionChange('flop', e.target.checked)}
                className="mr-2"
              />
              Flop
            </label>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
