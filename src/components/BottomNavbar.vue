<script setup>
import { RouterLink } from "vue-router"
import Analytics from "./icons/Analytics.vue"
import Bars from "./icons/Bars.vue"
import CreditCard from "./icons/CreditCard.vue"
import Home from "./icons/Home.vue"
import Receipt from "./icons/Receipt.vue"
</script>
<template>
    
<div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
    <div class="grid h-full max-w-lg grid-cols-5 mx-auto font-small">
        <RouterLink to ="/accounts" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <CreditCard class="w-5 h-5 mb-2 fill-gray-500 dark:fill-gray-400 group-hover:fill-blue-600 dark:group-hover:fill-blue-500"/>
            <span class="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Accounts</span>
        </RouterLink>
        <RouterLink to ="/transactions" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <Receipt class="w-5 h-5 mb-2 fill-gray-500 dark:fill-gray-400 group-hover:fill-blue-600 dark:group-hover:fill-blue-500"/>
            <span class="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Transactions</span>
        </RouterLink>
        <RouterLink to ="/" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <Home class="w-5 h-5 mb-2 fill-gray-500 dark:fill-gray-400 group-hover:fill-blue-600 dark:group-hover:fill-blue-500"/>
            <span class="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Home</span>
        </RouterLink>
        <RouterLink to ="/analytics" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <Analytics class="w-5 h-5 mb-2 fill-gray-500 dark:fill-gray-400 group-hover:fill-blue-600 dark:group-hover:fill-blue-500"/>
            <span class="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Analytics</span>
        </RouterLink>
        <RouterLink to ="/more" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <Bars class="w-5 h-5 mb-2 fill-gray-500 dark:fill-gray-400 group-hover:fill-blue-600 dark:group-hover:fill-blue-500"/>
            <span class="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">More</span>
        </RouterLink>
    </div>
</div>

</template>