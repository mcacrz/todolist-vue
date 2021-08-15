<script>
import {inject, onMounted, ref, watchEffect} from 'vue'
import { deleteStorage, selectStorage, updateStorage } from '../libraries/storageMethods'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import draggable from 'vuedraggable/src/vuedraggable'

export default {
  name:'TodoList',
  components:{
    'font-awesome-icon':FontAwesomeIcon,
    draggable
  },
  setup() {
    const KEYAPP = inject('KEYAPP');
    const todoInserted = inject('todoInserted');
    const todoList = ref([]);
    
    library.add([faTimes,faTrashAlt,faSortUp,faSortDown]);
    
    function deleteTodo(id) {
      const todoDeleted = selectStorage(KEYAPP,'list',null,['id|===|'+id])
      deleteStorage(KEYAPP,'list', id)
      orderPosition(todoDeleted.position)
      todoList.value = selectStorage(KEYAPP,'list') 
    }

    function loadTodoList() {
      if(Array.isArray(todoList.value) && todoList.value.length > 0){
        return todoList.value
      }

      todoList.value = selectStorage(KEYAPP,'list',null,null,['position|asc'])
    }

    function changeEvent(event){
      updatePosition(
        event.moved.element.id,
        event.moved.oldIndex,
        event.moved.newIndex
      )
    }

    function updateTodo(event) {
      updateStorage(
        KEYAPP,
        'list',
        event.currentTarget.value,
        {checked : (event.currentTarget.checked) ? 1 : 0}
      )

      todoList.value = selectStorage(KEYAPP,'list',null,null,['position|asc'])
    }

    function updatePosition(id, oldIndex, newIndex) {
      const allTodos = selectStorage(KEYAPP,'list')

      if(oldIndex > newIndex){
        allTodos.forEach(function(item){
          if(item.position >= newIndex && item.position < oldIndex){
            updateStorage(KEYAPP, 'list', item.id,{position:++item.position})
          }
        })

        updateStorage(KEYAPP,'list', id, {position:newIndex})
        return true
      }

      allTodos.forEach(function(item){
        if(item.position > oldIndex && item.position <= newIndex){
          updateStorage(KEYAPP, 'list', item.id, {position:--item.position})
        }
      })

      updateStorage(KEYAPP, 'list', id, {position:newIndex})
      return true
    }

    function orderPosition(position) {
      const allTodos = selectStorage(KEYAPP,'list')

      allTodos.forEach(function(item){
        if(parseInt(item.position) > parseInt(position)){
          updateStorage(KEYAPP,'list',item.id,{position:--item.position})
        }
      })
    }

    onMounted(() => loadTodoList())
    watchEffect(() => todoList.value = todoInserted.value)

    return {
      changeEvent,
      deleteTodo,
      updateTodo,
      updatePosition,
      todoList,
      drag:false
    }
  },
}
</script>

<template>
  <draggable
    v-model="todoList"
    group="todos"
    @start="drag=true" 
    @end="drag=false"
    @change="changeEvent"
    item-key="id"
    class="shadow-xl bg-white px-2 pt-3 pb-1 rounded-md flex-row" 
  >
    <template #item="{element}">
      <div class="mb-2 p-0.5 border-solid border-2 border-gray-200">
        <a href="" class="float-left mr-3 -mt-1 p-0.5" @click="() => deleteTodo(element.id)"><font-awesome-icon :icon="['far', 'trash-alt']" size="1x" /></a>
        <input type="checkbox" class="mr-3 rounded-md box-border h-4 w-4" :value="element.id" @change="updateTodo" :checked="element.checked == 1 ? true : false">
        <span :class="element.checked == 1 ? 'text-gray-400 line-through' : 'text-black'+' align-baseline'">{{element.value}}</span>
      </div>
    </template>
  </draggable>
</template>
