import Image from 'next/image'
import { motion } from 'framer-motion'

export default function LogoCarousel() {
  // Use only the most recognizable logos for a compact display
  const companies = [
    { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/220px-Apple_logo_black.svg.png' },
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/220px-Google_2015_logo.svg.png' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/220px-Microsoft_logo_%282012%29.svg.png' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/220px-Amazon_logo.svg.png' },
    { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/220px-Meta_Platforms_Inc._logo.svg.png' },
  ]

  return (
    <div className="flex items-center h-full w-full overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
        className="flex gap-5 items-center"
      >
        {companies.concat(companies).map((company, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 h-4 w-12 relative grayscale opacity-80 hover:grayscale-0 hover:opacity-100"
          >
            <Image
              src={company.logo}
              alt={`${company.name} logo`}
              width={48}
              height={16}
              className="object-contain w-full h-full"
              unoptimized={true}
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
} 