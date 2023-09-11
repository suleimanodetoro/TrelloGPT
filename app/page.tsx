//@ esentially means -> go to top level. Like ../../
import Header from '@/components/Header'
import Board from '@/components/Board'

import Image from 'next/image'
import Modal from '@/components/Modal'
Header

export default function Home() {
  return (
    <main>
      {/* Header Component */}
      <Modal/>
      <Header />

      {/* Board Component */}
      <Board />
    </main>

  )
}
