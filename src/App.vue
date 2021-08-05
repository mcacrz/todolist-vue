<script>
import { onBeforeMount, provide } from "vue";
import { createStorage } from "./libraries/storageMethods";
import Form from "./components/Form";

const KEYAPP = import.meta.env.KEY_APP;

export default {
  name: "ToDoListApp",
  components: {
    Form,
  },
  setup() {
    provide("KEYAPP", KEYAPP);
    onBeforeMount(() => createStorage(KEYAPP));

    return {};
  },
};
</script>

<template>
  <div class="container">
    <div class="flex flex-col mt-6">
      <div id="header" class="flex justify-center mb-3">
        <p class="font-sans font-medium text-white text-lg">
          TO-DO LIST
        </p>
      </div>
      <div id="main">
        <Form></Form>
      </div>
    </div>
  </div>
</template>
