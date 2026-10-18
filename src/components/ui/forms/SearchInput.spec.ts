import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchInput from './SearchInput.vue'

describe('SearchInput', () => {
  it('emits the entered query and updates its model', async () => {
    const wrapper = mount(SearchInput, {
      props: { modelValue: '' },
      global: { stubs: { FontAwesomeIcon: true } },
    })

    await wrapper.get('input').setValue('new zealand')

    expect(wrapper.emitted('search')).toEqual([['new zealand']])
    expect(wrapper.emitted('update:modelValue')).toEqual([['new zealand']])
    expect(wrapper.get('input').element.value).toBe('new zealand')
  })

  it('clears the query and emits an empty search', async () => {
    const wrapper = mount(SearchInput, {
      props: { modelValue: 'Japan' },
      global: { stubs: { FontAwesomeIcon: true } },
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('search')).toEqual([['']])
    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
  })
})
