import React from 'react'

export default function navigation() {
  return (
    <header className='navigation'>
        {/* left sidebar navigation */}
        <div>
                <ul className='left_menu'>
                    <li>HANDBAGS & WALLETS</li>
                    <li>NANAMOTA BASICS</li>
                    <li>LIMITED TIME SALE</li>
                </ul>
        </div>

        {/* logo   */}
        <div>
            <a href={'/#/'}>
                <img src={'./logo192.png'} alt="" />
            </a>
        </div>

        <div>
                <ul className='right_menu'>
                    <li>HANDBAGS & WALLETS</li>
                    <li>NANAMOTA BASICS</li>
                    <li>LIMITED TIME SALE</li>
                </ul>
        </div>

    </header>
  )
}
