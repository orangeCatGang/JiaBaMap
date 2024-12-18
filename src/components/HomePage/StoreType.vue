<script setup>
import { useRouter } from "vue-router";
import { useKeywordStore } from "@/stores/keywordStore";
const router = useRouter()
const keywordStore = useKeywordStore()

const navigateToSearch = (tag) => {
  keywordStore.navigateToSearch(router, tag)
}
</script>

<template>
    <!-- 餐點類型按鈕 -->
      <div>
        <h3 class="w-full px-4 mx-auto mb-2 text-2xl font-bold md:w-3/4 md:px-0 mt-7 text-amber-500">精選主題</h3>
        <div class="flex items-center justify-center">
          <div class="flex w-full gap-2 px-4 overflow-x-auto text-center text-white md:grid md:grid-cols-3 md:gap-2 md:w-3/4 md:px-0 scrollbar-hide">
            <div class="cursor-pointer group flex flex-col items-center justify-center flex-shrink-0 h-48 rounded bg-slate-500 md:col-span-2 md:flex-none min-w-[75%] sm:min-w-[50%] bg-index_btns_f bg-cover bg-center relative"
            @click="navigateToSearch('精緻高級')">
              <div class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-amber-500 group-hover:opacity-50"></div>
              <h3 class="z-10 text-xl font-bold">精緻高級</h3>
              <p class="z-10">6785 家餐廳</p>
            </div>
            <div class="cursor-pointer group flex flex-col items-center justify-center flex-shrink-0 h-48 rounded bg-slate-500 md:flex-none min-w-[75%] sm:min-w-[50%] bg-index_btns_b bg-cover bg-center relative"
            @click="navigateToSearch('早午餐')">
              <div class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-amber-500 group-hover:opacity-50"></div>
              <h3 class="z-10 text-xl font-bold">早午餐</h3>
              <p class="z-10">5779 家餐廳</p>
            </div>
            <div class="cursor-pointer group flex flex-col items-center justify-center flex-shrink-0 h-48 rounded bg-slate-500 md:flex-none min-w-[75%] sm:min-w-[50%] bg-index_btns_h bg-cover bg-center relative"
            @click="navigateToSearch('鍋類')">
              <div class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-amber-500 group-hover:opacity-50"></div>
              <h3 class="z-10 text-xl font-bold">鍋類</h3>
              <p class="z-10">4980 家餐廳</p>
            </div>
            <div class="cursor-pointer group flex flex-col items-center justify-center flex-shrink-0 h-48 rounded bg-slate-500 md:flex-none min-w-[75%] sm:min-w-[50%] bg-index_btns_j bg-cover bg-center relative"
            @click="navigateToSearch('日式')">
              <div class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-amber-500 group-hover:opacity-50"></div>
              <h3 class="z-10 text-xl font-bold">日式</h3>
              <p class="z-10">9126 家餐廳</p>
            </div>
            <div class="cursor-pointer group flex flex-col items-center justify-center flex-shrink-0 h-48 rounded bg-slate-500 md:flex-none min-w-[75%] sm:min-w-[50%] bg-index_btns_q bg-cover bg-center relative"
            @click="navigateToSearch('燒肉')">
              <div class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-amber-500 group-hover:opacity-50"></div>
              <h3 class="z-10 text-xl font-bold">燒肉</h3>
              <p class="z-10">2152 家餐廳</p>
            </div>
            <div class="cursor-pointer group flex flex-col items-center justify-center flex-shrink-0 h-48 rounded bg-slate-500 md:col-span-2 md:flex-none min-w-[75%] sm:min-w-[50%] bg-index_btns_d bg-cover bg-center relative"
            @click="navigateToSearch('甜點')">
              <div class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-amber-500 group-hover:opacity-50"></div>
              <h3 class="z-10 text-xl font-bold">甜點</h3>
              <p class="z-10">8230 家餐廳</p>
            </div>
            <div class="cursor-pointer group flex flex-col items-center justify-center flex-shrink-0 h-48 rounded bg-slate-500 md:flex-none min-w-[75%] sm:min-w-[50%] bg-index_btns_c bg-cover bg-center relative"
            @click="navigateToSearch('中式料理')">
              <div class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-amber-500 group-hover:opacity-50"></div>
              <h3 class="z-10 text-xl font-bold">中式料理</h3>
              <p class="z-10">7814 家餐廳</p>
            </div>
            <div class="cursor-pointer group flex flex-col items-center justify-center flex-shrink-0 h-48 rounded bg-slate-500 md:flex-none min-w-[75%] sm:min-w-[50%] bg-index_btns_k bg-cover bg-center relative"
            @click="navigateToSearch('韓式料理')">
              <div class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-amber-500 group-hover:opacity-50"></div>
              <h3 class="z-10 text-xl font-bold">韓式料理</h3>
              <p class="z-10">1630 家餐廳</p>
            </div>
            <div class="cursor-pointer group flex flex-col items-center justify-center flex-shrink-0 h-48 rounded bg-slate-500 md:flex-none min-w-[75%] sm:min-w-[50%] bg-index_btns_a bg-cover bg-center relative"
            @click="navigateToSearch('餐酒館')">
              <div class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-amber-500 group-hover:opacity-50"></div>
              <h3 class="z-10 text-xl font-bold">餐酒館</h3>
              <p class="z-10">1163 家餐廳</p>
            </div>
            <div class="cursor-pointer group flex flex-col items-center justify-center flex-shrink-0 h-48 rounded bg-slate-500 md:flex-none min-w-[75%] sm:min-w-[50%] bg-index_btns_i bg-cover bg-center relative"
            @click="navigateToSearch('居酒屋')">
              <div class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-amber-500 group-hover:opacity-50"></div>
              <h3 class="z-10 text-xl font-bold">居酒屋</h3>
              <p class="z-10">1613 家餐廳</p>
            </div>
          </div>
        </div>
        <div class="w-full mx-auto md:w-3/4">
          <p class="m-auto text-xs text-right mb-7 text-slate-500">圖片由 Ivan Torres, Delightin Dee, Brooke Lark, Shengpengpeng Cai, Farhad Ibrahimzade, Philipp Kämmerer, Jennie Brown, Luna Wang, Vicky Ng, Kelly Sikkema, ibmoon Kim 於 Unsplash 提供</p>
        </div>
      </div> 
</template>