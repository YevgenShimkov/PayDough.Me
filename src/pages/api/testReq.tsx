import {socials} from '@/pages/api/data/socials'

export default function handler(req,res) {
  res.status(200).json(socials);
}
