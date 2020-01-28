<!-- <script src="http://mrrio.github.io/jsPDF/dist/jspdf.debug.js"></script>
<script src="http://mrrio.github.io/jsPDF/dist/jspdf.min.js"></script> -->
<?php if ($result['user_lang'] == "ar-ar" || $result['user_lang'] == "ur-ur" || $result['user_lang'] == "fa-fa") { ?>
    <link rel="stylesheet" href="app_v1/assets/css/bootstrap-rtl.css">
    <?php $user_lang = true;
} else {
    ?>
    <link rel="stylesheet" href="app_v1/assets/css/bootstrap.min.css">
<?php } ?>
<?php $user_lang = true; ?>
<script src="app_v1/assets/css/jsPDF-1.2.60/dist/jspdf.debug.js"></script>
<script src="app_v1/assets/css/jsPDF-1.2.60/dist/jspdf.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>
<?php
/* @var $this yii\web\View */
$this->title = 'Training and Self Evaluation Test Results';
?>
<style>
    table.table.hea td, table.table.hea th {
        border: none !Important;
    }
    tbody.heabody {
        font-size: initial;
    }
    /*table.table.table-bordered{
        border-color: black !important;
    }*/
    .center{
        width: 50%;
        margin: 0 auto;
    }
</style>
<style>
    @media print
    {
        .no-print, .no-print *
        {
            display: none !important;
        }
    }
    .no-print{
        margin-top:25px;
        text-align: center;
    }
</style>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
<script>
    function printCertificate() {
        window.print();
    }

    function printCertificateLang() {
        PrintElem("#printPage");
    }
    function PrintElem(elem) {
        Popup($(elem).html());
    }
    function Popup(data) {
        var style = '<style> table.table.hea td, table.table.hea th {';
        style += 'border: none !Important;';
        style += '} tbody.heabody { font-size: initial; }';
        style += '.center{ width: 50%;margin: 0 auto; }</style>';
        var mywindow = window.open('', 'Print', 'height=400,width=600');
        mywindow.document.write('<html><head><title>Training and Self Evaluation Test Results</title>');
        mywindow.document.write('<link rel="stylesheet" href="app_v1/assets/css/bootstrap.min.css">');
<?php if ($result['user_lang'] == "ar-ar" || $result['user_lang'] == "ur-ur" || $result['user_lang'] == "fa-fa") { ?>
            mywindow.document.write('<link rel="stylesheet" href="app_v1/assets/css/bootstrap-rtl.css">');
    <?php $user_lang = true;
}
?>
        mywindow.document.write(style);
        mywindow.document.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></scri' + 'pt>');
        mywindow.document.write('<script>$(document).ready(function(){ window.print(); window.close();});</scri' + 'pt>')
        mywindow.document.write('</head><body">');
        mywindow.document.write('<div style="width: 970px; margin: 10px auto;" id="printPage">');
        mywindow.document.write(data);
        mywindow.document.write('</div>');
        mywindow.document.write('</body></html>');
        mywindow.document.close();
        mywindow.focus();
    }

</script>
<script>
    $(document).ready(function () {
        $("#close").click(function (event) {
            window.close();
            parent.history.back();
            return false;
        });

    });
</script>
<script>
    function genPDF() {
        html2canvas(document.body, {
            onrendered: function (canvas) {
                var img = canvas.toDataURL("image/png");
                var doc = new jsPDF();
                doc.addImage(img, "JPEG", -20, 20, 260, 0);
                doc.save("<?php echo $result['student']['studentId']; ?>.pdf");
                $("#close").show();
                $('#printCertificate').show();
                $('#download').show();
                $('#printCertificateLang').show();
            }
        });
    }

    $(document).ready(function () {
        $("#download").click(function () {
            $("#close").hide(0);
            $('#printCertificate').hide(0);
            $('#download').hide(0);
            $('#printCertificateLang').hide(0);
        });
    });
</script>

<div style="width: 970px; margin: 10px auto;display:none;" id="printPage">
    <div style="margin-top: 10px; padding-bottom: 10px; text-align: center;<?php echo isset($user_lang) ? 'margin-right: 25%' : 'margin-left: 25%'; ?>">
        <img src='app_v1assets/images/logo.png' style="height: 75px;" />
    </div>
    <div style="padding-top: 10px; <?php echo isset($user_lang) ? 'margin-right: 5%' : 'margin-left: 5%'; ?>" id="table">

        <table class='table hea'>
            <tbody class="heabody">
                <tr>
                    <th style="width: 200px;"><?php echo $result['page']['Date Tested']; ?></th>
                    <td><?php echo date("Y/m/d"); ?></td>
                </tr>
                <tr>
                    <th><?php echo $result['page']['Student Id']; ?></th>
                    <td><?php echo $result['student']['studentId']; ?></td>
                </tr>
                <tr>
                    <th><?php echo $result['page']['Student Name']; ?></th>
                    <td><?php echo $result['student']['name']; ?></td>
                </tr>
                <tr>
                    <th><?php echo $result['page']['Category']; ?></th>
                    <td><?php echo $result['category']; ?></td>
                </tr>
            </tbody>
        </table>
        <table class="table hea">
            <tbody class="heabody">
                <tr><th style="font-size: initial;">
            <div><?php echo $result['result']; ?></div>
            </th></tr>
            </tbody>
        </table>
        <table class="table hea">
            <tbody class="heabody">
                <tr style="text-decoration: underline;">
                    <th><?php echo $result['page']['Topic Area']; ?></th>
                    <th><div class="center"><?php echo $result['page']['No of Incorrect Answers']; ?></div></th>
            </tr>
            <?php
            $topics = $result['topics'];
            foreach ($topics as $key => $topic) {
                ?>
                <tr>
                    <th>
    <?php echo $key; ?>
                    </th>
                    <td>
                        <div class="center"><div class="center"><?php echo $topic; ?></div></div>
                    </td>
                </tr>
                <?php
            }
            ?>
            </tbody>
        </table>
        <table class="table table-bordered" style="width: 85%;">
            <tr>
                <th style="width: 25%;"><div class=""><?php echo $result['page']['Questions']; ?></div></th>
            <th style="width: 20%;"><div class=""><?php echo $result['page']['Number of Questions per Test']; ?></div></th>
                <th style="width: 20%;"><div class=""><?php echo $result['page']['Minimum Correct Answers Required']; ?></div></th>
            <th style="width: 20%;"><div class=""><?php echo $result['page']['Correct Answers']; ?></div></th>
            </tr>
            <tr>
                <th><div class=""><?php echo $result['page']['Specific Questions']; ?></div></th>
            <td><div class=""><?php echo $result['noofspecificquestion']; ?></div></td>
            <td><div class=""><?php echo $result['noofreqspecificanswer']; ?></div></td>
            <td><div class=""><?php echo $result['correctSpecificAnswers'] ?></div></td>
            </tr>
            <tr>
                <th><div class=""><?php echo $result['page']['Common Questions']; ?></div></th>
            <td><div class=""><?php echo $result['noofcommonquestion']; ?></div></td>
            <td><div class=""><?php echo $result['noofreqcommonanswer']; ?></div></td>
            <td><div class=""><?php echo $result['correctCommonAnswers'] ?></div></td>
            </tr>
        </table>
    </div>
    <!-- <div class="no-print">
        <button id = 'printCertificate' onClick="printCertificate()"><?php echo $result['page']['Print']; ?></button>
        <button onClick="genPDF()" id='download'><?php echo $result['page']['download']; ?></button>
        <button id = "close"><?php echo $result['page']['Close']; ?></button>
    </div> -->
</div>
<!-- arabic print page -->

<div style="width: 970px; margin: 10px auto;" id="arabicPrintPage">
    <div style="margin-top: 10px; padding-bottom: 10px; <?php echo isset($user_lang) ? 'margin-right: 25%' : 'margin-left: 25%'; ?>">
        <img src='app_v1assets/images/logo.png' style="height: 75px;" />
    </div>
    <div style="padding-top: 10px; <?php echo isset($user_lang) ? 'margin-right: 5%' : 'margin-left: 5%'; ?>" id="table">

        <table class='table hea'>
            <tbody class="heabody">
                <tr>
                    <th style="width: 200px;"><?php echo $result['content']['Date Tested']; ?></th>
                    <td><?php echo date("Y/m/d"); ?></td>
                </tr>
                <tr>
                    <th><?php echo $result['content']['Student Id']; ?></th>
                    <td><?php echo $result['student']['studentId']; ?></td>
                </tr>
                <tr>
                    <th><?php echo $result['content']['Student Name']; ?></th>
                    <td><?php echo $result['student']['name']; ?></td>
                </tr>
                <tr>
                    <th><?php echo $result['content']['Category']; ?></th>
                    <td><?php echo $result['category']; ?></td>
                </tr>
            </tbody>
        </table>
        <table class="table hea">
            <tbody class="heabody">
                <tr><th style="font-size: initial;">
            <div><?php
                if ($result['user_result']) {
                    echo $result['content']['pass'];
                } else {
                    echo $result['content']['fail'];
                }
                ?></div>
            </th></tr>
            </tbody>
        </table>
        <table class="table hea">
            <tbody class="heabody">
                <tr style="text-decoration: underline;">
                    <th><?php echo $result['content']['Topic Area']; ?></th>
                    <th><div class="center"><?php echo $result['content']['No of Incorrect Answers']; ?></div></th>
            </tr>
            <?php
            $topics = $result['topics'];
            foreach ($topics as $key => $topic) {
                ?>
                <tr>
                    <th>
    <?php echo $key; ?>
                    </th>
                    <td>
                        <div class="center"><div class="center"><?php echo $topic; ?></div></div>
                    </td>
                </tr>
                <?php
            }
            ?>
            </tbody>
        </table>
        <table class="table table-bordered" style="width: 85%;">
            <tr>
                <th style="width: 25%;"><div class=""><?php echo $result['content']['Questions']; ?></div></th>
            <th style="width: 20%;"><div class=""><?php echo $result['content']['Number of Questions per Test']; ?></div></th>
            <th style="width: 20%;"><div class=""><?php echo $result['content']['Minimum Correct Answers Required']; ?></div></th>
            <th style="width: 20%;"><div class=""><?php echo $result['content']['Correct Answers']; ?></div></th>
            </tr>
            <tr>
                <th><div class=""><?php echo $result['content']['Specific Questions']; ?></div></th>
            <td><div class=""><?php echo $result['noofspecificquestion']; ?></div></td>
            <td><div class=""><?php echo $result['noofreqspecificanswer']; ?></div></td>
            <td><div class=""><?php echo $result['correctSpecificAnswers'] ?></div></td>
            </tr>
            <tr>
                <th><div class=""><?php echo $result['content']['Common Questions']; ?></div></th>
            <td><div class=""><?php echo $result['noofcommonquestion']; ?></div></td>
            <td><div class=""><?php echo $result['noofreqcommonanswer']; ?></div></td>
            <td><div class=""><?php echo $result['correctCommonAnswers'] ?></div></td>
            </tr>
        </table>
    </div>
    <div class="no-print">
        <button id = 'printCertificateLang' onClick="printCertificateLang()">Print</button>
        <button id = 'printCertificate' onClick="printCertificate()">Print</button>
        <button onClick="genPDF()" id='download'>Download</button>
        <button id = "close">Close</button>
    </div>
</div>
