import api from './shiori-api.js'

let el = $('#favbar')
let favbar = await api.getCollectionItems('none')

let temp = `<a class="button is-rounded" href="$url" target="_blank">
<span class="icon">
    <i class="fa-solid fa-folder"></i>
</span>
<span class="is-clipped">$name</span>
</a>`

favbar.data.forEach(e => {
    let t = temp.replace('$url', e.url).replace('$name', e.name)
    el.append(t)
})