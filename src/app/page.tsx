import Image from 'next/image'
import { ColorPicker } from 'antd'
import { Card } from "antd";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="">
      <ColorPicker />
      <Card>asdasd</Card>
      <Link href={'/admin'}>admin</Link>
    </main>
  )
}
