export function useSearchParams() {
   const search = new URLSearchParams(window.location.search)
   const station = search.get("station")
   const origin = search.get("origin")
   const trainNumber = search.get("trainNumber")

   const setSearch = (newParams) => {
      const filteredParams = Object.entries(newParams)
         .reduce((params, [field, value]) => {
            if (!value) return params
            return {
               ...params,
               [field]: value
            }
         }, {})
      const newSearch = new URLSearchParams(filteredParams).toString()
      const newUrl = newSearch
         ? `${window.location.pathname}?${newSearch.toString()}`
         : window.location.pathname
      window.history.replaceState(null, '', newUrl);
   }

   return [{station, origin, trainNumber}, setSearch]
}
