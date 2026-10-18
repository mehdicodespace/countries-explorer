import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CountryCard from './CountryCard.vue'
import type { CountryCard as CountryCardModel } from '@/types/country'

const country: CountryCardModel = {
  id: 'JPN',
  code: 'JPN',
  name: 'Japan',
  flag: 'https://flags.example/jp.svg',
  population: 123456789,
  region: 'Asia',
  capital: 'Tokyo',
}

describe('CountryCard', () => {
  const mountCard = () =>
    mount(CountryCard, {
      props: { country },
      global: { stubs: { FontAwesomeIcon: true } },
    })

  it('shows country details with a formatted population and descriptive flag text', () => {
    const wrapper = mountCard()

    expect(wrapper.get('h3').text()).toBe('Japan')
    expect(wrapper.text()).toContain('123,456,789')
    expect(wrapper.text()).toContain('Asia')
    expect(wrapper.text()).toContain('Tokyo')
    expect(wrapper.get('img').attributes()).toMatchObject({
      src: country.flag,
      alt: 'Flag of Japan',
    })
  })

  it('emits the selected country when the card is clicked', async () => {
    const wrapper = mountCard()

    await wrapper.get('.cursor-pointer').trigger('click')

    expect(wrapper.emitted('click')).toEqual([[country]])
  })

  it('switches to the placeholder flag when the image fails', async () => {
    const wrapper = mountCard()

    await wrapper.get('img').trigger('error')

    expect(new URL(wrapper.get('img').element.src).pathname).toBe('/placeholder-flag.svg')
  })
})
