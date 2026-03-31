<template>
  <RouterView />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, provide } from 'vue';
import { ClientKey } from './main';
import { GameClient } from './game/GameClient';

const client = new GameClient('/api/game');
provide(ClientKey, client);
onBeforeUnmount(client.leaveLobby);
</script>
