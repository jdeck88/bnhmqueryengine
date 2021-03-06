<%@ include file="header-home.jsp" %>

<div id="validation" class="section">
    <div class="row" id="query">
        <p>
            Query Berkeley Natural History Museum Collections
        </p>

        <div class="form-horizontal my-form">
          <div class="form-group form-group-sm" id="author_row">
            <label for="author" class="col-md-2 control-label">Name</label>
          <div class="col-md-3" id="namesoupformgroup">
              <input type="text" class="form-control" id="namesoup">
          </div>
          <div class="col-md-1" id="toggle_query">
            <button class="btn btn-default btn-sm" type="button" onclick="toggleQuery();">+</button>
          </div>
          <div class="col-md-1"><input type="button" value="Search" class="btn btn-default btn-sm btn-block" id="search"></div>
          <div class="col-md-1"><input type="button" value="Observations" class="btn btn-default btn-sm btn-block" id="observations"></div>
          </div>
        </div>

        <form class="form-inline my-form" >
        <div class="toggle-content" id="query_toggle">
          <div class="form-group form-group-sm">
            <label for="begin_date" class="control-label">Year Between</label>
              <input type="text" class="form-control int_input" name="begin_date">
              <span id="and" style="display:inline-block;vertical-align:bottom;line-height:normal;">and</span>
              <input type="text" class="form-control int_input" name="end_date">
          </div>
          <div class="form-group form-group-sm" id="section_title">
            <label for="section_title" class="control-label">Section Title</label>
              <input type="text" class="form-control" name="section_title">
          </div>
          <div class="form-group form-group-sm">
            <label for="volume_id" class="control-label">Volume Id</label>
              <input type="text" class="form-control int_input" name="volume_id">
          </div>
          <div class="form-group form-group-sm">
              <div class="checkbox">
                <label>
                  <input type="checkbox" name="scanned_only" value="true"> Scanned sections only
                </label>
              </div>
          </div>
          </div>
        </form>
    </div>

        <div class="container-fluid">
        <div class="row" id="results">
        </div>
        </div>

</div>


<script>
    $(document).ready(function() {
        $("#search").click(function() {
            if (checkValue($("#namesoup"))) {
                search("q="+$("#namesoup").val());
            }
        });
        $("#observations").click(function() {
            if (checkValue($("#namesoup"))) {
                observations("q="+$("#namesoup").val());
            }
        });
    });
</script>

<%@ include file="footer.jsp" %>
