function binSearch(num, arr) {
    let low = 0;
    let high = arr.length - 1;
    let curr_idx = Math.floor(arr.length / 2);
    while (true) {
        if (arr[curr_idx] == num) {
            return curr_idx;
        }
        if (low >= high) {
            return -1;
        }
        if (num > arr[curr_idx]) {
            low = curr_idx + 1;
        }
        else {
            high = curr_idx - 1;
        }
        curr_idx = Math.floor((high + low) / 2);
    }
}
// dfs, по сути
function findTheKey(box) {
    for (let item in box) {
        if (item === "key") {
            console.log(`The key is in the box! The key is ${box[item]}`);
            return
        }
        else if (typeof box[item] === "object") {
            findTheKey({ ...box[item] });
        }
    }
}

function sum(arr) {
    if (arr.length === 1) {
        return arr[0];
    }
    return arr[0] + sum(arr.slice(1));
}

function quicksort(arr) {
    if (arr.length < 2) {
        return arr;
    }
    if (arr.length === 2) {
        return arr[0] > arr[1] ? [arr[1], arr[0]] : arr;
    }
    let pivot_idx = Math.floor(Math.random() * arr.length);
    let right_part = arr.filter((element) => element > arr[pivot_idx]);
    let left_part = arr.filter((element) => element <= arr[pivot_idx]);
    return [...quicksort(left_part), arr[pivot_idx], ...quicksort(right_part)];
}

// jenkins hash
function jenkins(key) {
    let i = 0;
    let hash = 0;
    while (i != key.length) {
        hash += key[i++].charCodeAt();
        hash += hash << 10;
        hash ^= hash >> 6;
    }
    hash += hash << 3;
    hash ^= hash >> 11;
    hash += hash << 15;
    return hash;
}

class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(element) {
        this.items.push(element);
    }

    dequeue() {
        return this.isEmpty() ? "Queue is empty" : this.items.shift();
    }

    peek() {
        return this.isEmpty() ? "Queue is empty" : this.items[0];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    print() {
        console.log(this.items.join(" -> "));
    }
}

function bfs_shortest_path(graph, start_node) {
    let graph = {
        "cab": { edges: ["cat", "car"] },
        "cat": { edges: ["mat", "bat"] },
        "car": { edges: ["cat", "bar"] },
        "mat": { edges: ["bat"] },
        "bar": { edges: ["bat"] },
        "bat": { edges: [] }
    }
    let edges_count = 0;
    for (let idx in graph) {
        edges_count += graph[idx]["edges"].length
    }
    for (let idx in graph) {
        graph[idx]["dist"] = edges_count;
        graph[idx]["visited"] = false;
    }
    let queue = new Queue();
    graph[start_node]["visited"] = true;
    graph[start_node]["dist"] = 0;
    queue.enqueue(start_node);
    while (!queue.isEmpty()) {
        let curr_idx = queue.dequeue();
        console.log(curr_idx);
        let node = graph[curr_idx];
        for (let idx in node["edges"]) {
            node_idx = node["edges"][idx];
            if (graph[node_idx]["visited"] && (node["dist"] + 1 < graph[node_idx]["dist"])) {
                graph[node_idx]["dist"] = node["dist"] + 1;
                queue.enqueue(node_idx);
            }
            else if (!graph[node_idx]["visited"]) {
                graph[node_idx]["dist"] = node["dist"] + 1;
                queue.enqueue(node_idx);
            }
            graph[node_idx]["visited"] = true;
        }
    }
    return graph;
}

// Тасование Фишера-Йетса
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// fast anagram cleaning
function aclean(arr) {
    let anagram_filter = {};
    let result = [];
    for (let str of arr) {
        let new_str = str.toLowerCase();
        let sum = 0;
        let prod = 1;
        for (let char of new_str) {
            let charcode = char.charCodeAt(0);
            sum += charcode;
            prod *= charcode;
        }
        if (anagram_filter[sum] !== prod) {
            result.push(new_str);
            anagram_filter[sum] = prod;
        }
    }
    return result;
}

// backpack task
function best_backpack(items, capacity) {

    // let backpack_items = {
    //     "water": {
    //         weight: 3,
    //         value: 10,
    //         name: "water"
    //     },
    //     "book": {
    //         weight: 1,
    //         value: 3,
    //         name: "book"
    //     },
    //     "food": {
    //         weight: 2,
    //         value: 9,
    //         name: "food"
    //     },
    //     "jacket": {
    //         weight: 2,
    //         value: 5,
    //         name: "jacket"
    //     },
    //     "camera": {
    //         weight: 1,
    //         value: 6,
    //         name: "camera"
    //     },
    // }
    // let backpack_capacity = 6;

    let item_names = Object.keys(items);
    let num_items = item_names.length;
    let weight_step = item_names.reduce((acc, item_name) => items[item_name].weight < acc ? items[item_name].weight : acc, items["water"].weight);
    let backpack_weight_steps = Array.from(
        { length: (capacity - weight_step) / weight_step + 1 },
        (value, index) => weight_step + index * weight_step
    );
    let num_columns = backpack_weight_steps.length;
    let backpack_table = item_names.reduce((acc, item_name, index) => {
        let arr = Array(num_columns).keys();
        // console.log(arr.length);
        let res = arr.reduce((arr_acc) => {
            let backpack = {
                value: 0,
                curr_items: []
            };
            return [...arr_acc, backpack];
        }, []);
        // console.log(res);
        return [...acc, res];
    }, []);
    for (let i = 0; i < num_items; i++) {
        let curr_item = items[item_names[i]];
        for (let j = 0; j < num_columns; j++) {
            let remaining_capacity = backpack_weight_steps[j] - curr_item.weight;
            if (i == 0) {
                if (remaining_capacity < 0) {
                    backpack_table[i][j].value = 0;
                    backpack_table[i][j].curr_items = [];
                }
                else {
                    backpack_table[i][j].value = curr_item.value;
                    backpack_table[i][j].curr_items = [curr_item];
                }
                console.log(backpack_table[i]);
            }
            else {
                let rem_cap_index = Math.floor(remaining_capacity / weight_step) - 1;
                if (remaining_capacity === 0 && (backpack_table[i - 1][j].value < curr_item.value)) {
                    backpack_table[i][j].value = curr_item.value;
                    backpack_table[i][j].curr_items = [curr_item];
                }
                else if (rem_cap_index >= 0 && (backpack_table[i - 1][j].value < curr_item.value + backpack_table[i - 1][rem_cap_index].value)) {
                    backpack_table[i][j].value = curr_item.value + backpack_table[i - 1][rem_cap_index].value;
                    backpack_table[i][j].curr_items = [...backpack_table[i - 1][rem_cap_index].curr_items, curr_item];
                }
                else {
                    let found = false;

                    backpack_table[i][j].value = backpack_table[i - 1][j].value;
                    backpack_table[i][j].curr_items = backpack_table[i - 1][j].curr_items;
                }
            }
        }
    }
    return backpack_table[num_items - 1][num_columns - 1];
}

function biggest_substring(str1, str2) {
    let table = Array.from(str1).reduce((whole_table, char1, index1) => {
        let row = Array.from(str2).reduce((table_row, char2, index2) => {
            table_row[index2] = {
                len: 0,
                substr: ""
            };
            return table_row;
        }, {})
        whole_table[index1] = row;
        return whole_table;
    }, {});
    // console.log(table);
    let max_len = {
        len: 0,
        substr: ""
    };
    for (let i = 0; i < str1.length; i++) {
        for (let j = 0; j < str2.length; j++) {
            if (str1[i] === str2[j]) {
                table[i][j].len = i == 0 || j == 0 ? 1 : table[i - 1][j - 1].len + 1;
                table[i][j].substr = i == 0 || j == 0 ? str1[i] : table[i - 1][j - 1].substr + str1[i];
            }
            else {
                table[i][j].len = 0;
                table[i][j].substr = "";
            }
            if (table[i][j].len > max_len.len) {
                max_len = table[i][j];
            }
        }
    }
    return max_len.substr;
}

{
    // min-heap data structure
    class Heap {
        constructor(numbers) {
            this.heap = numbers;
            this.buildHeap();
        }

        buildHeap() {
            for (let i = Math.floor(this.heap.length / 2); i >= 0; i--) {
                this.heapify(i)
            }
        }

        heapify(index) {
            let left;
            let right;
            let min;

            while (true) {
                left = 2 * index + 1;
                right = 2 * index + 2;
                min = index;
                // console.log(left, right, index);

                if (left < this.heap.length && this.heap[left] < this.heap[min]) {
                    min = left;
                }
                if (right < this.heap.length && this.heap[right] < this.heap[min]) {
                    min = right;
                }
                if (min === index) {
                    break;
                }
                // console.log(this.heap[min], this.heap[index]);
                [this.heap[index], this.heap[min]] = [this.heap[min], this.heap[index]];
                // console.log(this.heap[min], this.heap[index]);
            }
        }

        insert(num) {
            this.heap = [...this.heap, num];
            let index = this.heap.length - 1;
            let parent = (index - 1) / 2;

            while (index > 0 && this.heap[parent] > this.heap[index]) {
                [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
                index = parent;
                parent = (index - 1) / 2;
            }
        }

        getMin() {
            let min = this.heap[0];
            this.heap[0] = this.heap[this.heap.length - 1];
            this.heap.splice(this.heap.length - 1, 1);
            this.buildHeap();
            return min;
        }

        heapSort() {
            let arr = [];

            while (this.heap.length !== 0) {
                console.log(arr.length, this.heap.length);
                arr.push(this.getMin());
            }
            return arr;
        }
    }

    let arr = [1, 6, 3, 17, 20, 15, 5, 9, 7, 11, 8, -24, 48, -150];
    let heap = new Heap(arr);
    console.log(heap.heap);
    console.log(heap.heapSort());
}

function insertionSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        while (arr[i] > arr[i + 1]) {
            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
            i--;
            if (i < 0) {
                break;
            }
        }
    }
    return arr;
}

function radixSort(arr, base) {
    // you can enter whatever base you want, but lower than the numbers in array
    let buckets = Array(base).fill([]).reduce((acc, _) => [...acc, []], []);
    let exp = 1;
    let max_val = Math.max(...arr);
    while (Math.floor(max_val / exp) > 0) {
        while (arr.length > 0) {
            let num = arr.splice(0, 1)[0];
            let idx = (Math.floor(num / exp) % base);
            buckets[idx].push(num);
        }

        for (let bucket of buckets) {
            while (bucket.length > 0) {
                let num = bucket.splice(0, 1)[0];
                arr.push(num);
            }
        }
        exp *= base;
    }
    return arr;
}

// merge sort
function merge(arr1, arr2) {
    let res = [];
    let idx1 = 0;
    let idx2 = 0;
    while (idx1 < arr1.length || idx2 < arr2.length) {
        if (idx1 < arr1.length && idx2 < arr2.length && arr1[idx1] < arr2[idx2]) {
            res.push(arr1[idx1]);
            idx1++;
        }
        else if (idx2 < arr2.length) {
            res.push(arr2[idx2]);
            idx2++;
        }
        else {
            res.push(arr1[idx1]);
            idx1++;
        }
    }
    return res;
}

function mergeSort(arr) {
    if (arr.length < 2) {
        return arr;
    }
    if (arr.length === 2) {
        return arr[0] < arr[1] ? [arr[0], arr[1]] : [arr[1], arr[0]];
    }
    let arr_center = Math.floor(arr.length / 2);
    let res = merge(mergeSort(arr.slice(0, arr_center)), mergeSort(arr.slice(arr_center)));
    console.log(res);
    return res;
}

// каррирование функции
function curry(func) {
    return function curried(...args) {
        if (func.length < args.length) {
            return func.apply(this, args);
        }
        else {
            return function (...args2) {
                return curried.apply(this, args.concat(args2));
            }
        }
    }
}