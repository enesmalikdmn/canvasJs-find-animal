<template>
    <div>
        <img :style="{width: '876px', height: '710px', transform: `rotate(${rotateDegree}deg)`}" id=img src="../assets/animals-1.png" alt="ingilizce-hayvanlar-1" />
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import CanvasDrawMixin from "./mixins/CanvasDrawMixin";
import { saveAndDrawLine } from "../helpers/draw.js";
// import { createWorker, PSM } from 'tesseract.js';
// const worker = createWorker({
//   logger: m => console.log(m),
// });

export default {
    name: "ImgViewer",
    mixins: [CanvasDrawMixin],
    data() {
        return {
            imgElement: {},
        }
    },
    computed: {
        ...mapGetters('auth', ['jwtToken']),
        ...mapGetters('packages', ['activePackage', 'activePage']),
        ...mapGetters("viewer", ["drawActions", "rectPosition", "pdfWidth", "pdfHeight", "rotateDegree"])
    },
    methods: {
        saveAndDrawLine,
        ...mapActions("viewer", ["setPdfWidth", "setPdfHeight", "setRotateDegree"]),
        getImgSrc (pet) {
            var images = require.context('../assets/', false, /\.jpg$/)
            return images('./' + pet + ".jpg")
        },
    },
    async mounted () {
        this.imgElement = document.getElementById("img")
        // const page = 0
        // this.setPdfWidth(Information.pageHeights[page])
        // this.setPdfHeight(Information.pageWidths[page])
    },
    watch: {
        async rectPosition () {
            // const rectangle = val
            // console.log(rectangle);
            // await worker.load();
            // await worker.loadLanguage('eng');
            // // await worker.initialize('eng', OEM.LSTM_ONLY);
            // await worker.initialize('eng');
            // await worker.setParameters({
            //     tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
            // });
            // rectangle.left += 11
            // rectangle.top += 195
            // const { data: { lines } } = await worker.recognize(this.imgElement, {rectangle});
            // console.log(lines);
            // lines.map((line) => this.saveAndDrawLine(this.drawActions,
            // line.bbox.x0 - 11,
            // line.bbox.y0 - 195,
            // (line.bbox.x1 - line.bbox.x0) - 11,
            // (line.bbox.y1 - line.bbox.y0) - 195,
            // "row",
            // 710,
            // 876
            // ))
        },
    }
}
</script>
<style>
</style>