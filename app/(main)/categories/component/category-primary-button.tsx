'use client'
import { Button } from '@/components/ui/button'
import { useDialog } from '@/context/dialog-provider'
import { RiAddLine } from '@remixicon/react'


export default function CategoryPrimaryButton() {
    const { setOpen } = useDialog()
    return (
        <div className='flex gap-2'>
            <Button className='space-x-1' onClick={() => setOpen('add')}>
                <span>Tambah Data</span> <RiAddLine size={18} />
            </Button>
        </div>
    )
}
